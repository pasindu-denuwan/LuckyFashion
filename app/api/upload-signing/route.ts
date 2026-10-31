import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(request: NextRequest) {
  try {
    const { filename, fileType, fileSize } = await request.json();

    if (!filename || !fileType) {
      return NextResponse.json({ error: 'Filename and fileType are required' }, { status: 400 });
    }

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 25MB limit' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload JPG, PNG, WebP, SVG, or PDF.' }, { status: 400 });
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueId = crypto.randomUUID();
    const filePath = `quotations/${new Date().getFullYear()}/${uniqueId}-${cleanFilename}`;

    const adminClient = createAdminClient();
    const { data, error } = await adminClient.storage
      .from('quotation-private')
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error('Storage sign error:', error);
      return NextResponse.json({ error: 'Failed to issue upload URL' }, { status: 500 });
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      filePath: filePath,
    });
  } catch (error) {
    console.error('Upload signing exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

