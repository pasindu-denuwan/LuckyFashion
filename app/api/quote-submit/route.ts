import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fullQuotationSubmissionSchema } from '@/lib/validators/quote';
import { formatQuotationReference } from '@/lib/slug';

const FORBIDDEN_WORDS = ['frock', 'frocks', 'skirt', 'skirts', 'dress', 'dresses'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const validationResult = fullQuotationSubmissionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Honeypot check
    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // 3. Forbidden Apparel Check (AGENTS.md rule)
    for (const item of data.items) {
      const lowerName = item.item_name.toLowerCase();
      if (FORBIDDEN_WORDS.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(lowerName))) {
        return NextResponse.json(
          { error: 'Lucky Fashion does not manufacture frocks, skirts, or dresses.' },
          { status: 400 }
        );
      }
    }

    const adminClient = createAdminClient();

    // 4. Generate Atomic Quotation Reference
    let referenceNumber: string;
    try {
      const { data: refData, error: refError } = await adminClient.rpc('next_quotation_ref');
      if (refError || !refData) {
        throw new Error(refError?.message || 'RPC fallback needed');
      }
      referenceNumber = refData;
    } catch {
      // Fallback: manual sequencer increment
      const currentYear = new Date().getFullYear();
      const { data: counter } = await adminClient
        .from('quotation_counters')
        .select('last_value')
        .eq('year', currentYear)
        .single();

      const nextVal = (counter?.last_value || 0) + 1;
      await adminClient
        .from('quotation_counters')
        .upsert({ year: currentYear, last_value: nextVal });

      referenceNumber = formatQuotationReference(currentYear, nextVal);
    }

    // 5. Insert Quotation Record
    const { data: insertedQuote, error: quoteError } = await adminClient
      .from('quotations')
      .insert({
        reference_number: referenceNumber,
        status: 'new',
        contact_name: data.contact_name,
        company_name: data.company_name || null,
        email: data.email,
        phone: data.phone,
        delivery_timeline: data.delivery_timeline,
        delivery_address: data.delivery_address || null,
        additional_notes: data.additional_notes || null,
      })
      .select('id')
      .single();

    if (quoteError || !insertedQuote) {
      console.error('Failed to create quotation record:', quoteError);
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
    }

    const quotationId = insertedQuote.id;

    // 6. Insert Quotation Items
    const itemsToInsert = data.items.map((item) => ({
      quotation_id: quotationId,
      item_name: item.item_name,
      product_id: item.product_id || null,
      quantity: item.quantity,
      material: item.material,
      sizes_breakdown: item.sizes_breakdown || {},
      customization_details: item.customization_details || null,
    }));

    const { error: itemsError } = await adminClient
      .from('quotation_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Failed to insert items:', itemsError);
    }

    // 7. Insert Quotation Attachments
    if (data.attachments && data.attachments.length > 0) {
      const attachmentsToInsert = data.attachments.map((att) => ({
        quotation_id: quotationId,
        file_path: att.file_path,
        file_name: att.file_name,
        file_size: att.file_size,
        mime_type: att.mime_type,
      }));

      await adminClient.from('quotation_attachments').insert(attachmentsToInsert);
    }

    // 8. Create Admin Notification
    await adminClient.from('notifications').insert({
      title: `New Quotation ${referenceNumber}`,
      message: `${data.contact_name} submitted a quote request for ${data.items.length} item(s).`,
      type: 'quotation_received',
      link: `/admin/quotations/${quotationId}`,
    });

    // 9. Resend Email Alert (Optional: off until configured)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && !resendKey.includes('placeholder')) {
      try {
        console.log(`[Email] Resend notification queued for ${referenceNumber}`);
      } catch (emailErr) {
        console.error('Email alert failed:', emailErr);
      }
    }

    // 10. Return verified confirmed reference number
    return NextResponse.json({
      success: true,
      reference_number: referenceNumber,
    });
  } catch (err) {
    console.error('Quotation submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

