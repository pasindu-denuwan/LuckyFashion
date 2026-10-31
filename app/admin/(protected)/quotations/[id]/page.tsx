import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Download,
  FileText,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminQuotationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: quote } = await supabase
    .from("quotations")
    .select("*, quotation_items(*), quotation_attachments(*)")
    .eq("id", params.id)
    .single();

  if (!quote) {
    notFound();
  }

  // Fetch internal notes
  const { data: notes } = await supabase
    .from("internal_notes")
    .select("*")
    .eq("entity_type", "quotation")
    .eq("entity_id", quote.id)
    .order("created_at", { ascending: false });

  // Generate signed URLs for attachments in quotation-private bucket
  const adminClient = createAdminClient();
  const attachmentsWithSignedUrls = await Promise.all(
    (quote.quotation_attachments || []).map(async (att: { id: string; file_path: string; file_name: string; file_size: number; mime_type: string }) => {
      const { data: signedData } = await adminClient.storage
        .from("quotation-private")
        .createSignedUrl(att.file_path, 60 * 60); // 1 hour valid
      return {
        ...att,
        downloadUrl: signedData?.signedUrl || null,
      };
    })
  );

  async function updateStatus(formData: FormData) {
    "use server";
    const newStatus = formData.get("status") as string;
    const client = createClient();
    await client
      .from("quotations")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", params.id);
    revalidatePath(`/admin/quotations/${params.id}`);
    revalidatePath("/admin/quotations");
  }

  async function addNote(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    if (!content) return;
    const client = createClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    await client.from("internal_notes").insert({
      entity_type: "quotation",
      entity_id: params.id,
      author_id: user?.id || null,
      author_name: user?.email || "Admin",
      content,
    });
    revalidatePath(`/admin/quotations/${params.id}`);
  }

  return (
    <div className="space-y-6">
      {/* Navigation and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/quotations">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-lucky-dark flex items-center gap-3">
              <span>Quotation {quote.reference_number}</span>
              <StatusBadge status={quote.status} />
            </h1>
            <p className="text-xs text-lucky-mutedText">
              Received on {new Date(quote.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status Switcher Form */}
        <form action={updateStatus} className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={quote.status}
            className="text-xs font-semibold rounded-lg border border-lucky-borderLight px-3 py-2 bg-white text-lucky-dark focus:outline-none focus:ring-2 focus:ring-lucky-blue"
          >
            <option value="new">Status: New</option>
            <option value="in_review">Status: In Review</option>
            <option value="estimated">Status: Estimated</option>
            <option value="approved">Status: Approved</option>
            <option value="rejected">Status: Rejected</option>
            <option value="archived">Status: Archived</option>
          </select>
          <Button size="sm" variant="default" type="submit">
            Update Status
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items and Specifications (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requested Items Card */}
          <Card>
            <CardHeader>
              <CardTitle>Requested Garment Items ({quote.quotation_items?.length || 0})</CardTitle>
              <CardDescription>
                Detailed specifications provided by the client.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quote.quotation_items && quote.quotation_items.length > 0 ? (
                quote.quotation_items.map((item: any, idx: number) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl border border-lucky-borderLight bg-slate-50/50 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold font-heading text-lucky-dark">
                          {item.item_name}
                        </h4>
                        <span className="text-xs text-lucky-mutedText">
                          Material: <strong className="text-lucky-dark">{item.material || "Standard"}</strong>
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-lucky-lightNeutral text-xs font-bold text-lucky-dark">
                        Total Quantity: {item.quantity}
                      </span>
                    </div>

                    {item.sizes_breakdown && Object.keys(item.sizes_breakdown).length > 0 && (
                      <div>
                        <span className="text-xs uppercase font-semibold text-lucky-mutedText block mb-1">
                          Size Breakdown
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(item.sizes_breakdown).map(([size, count]) => (
                            <span
                              key={size}
                              className="px-2 py-0.5 rounded border border-lucky-borderLight bg-white text-xs font-mono font-medium"
                            >
                              {size}: <strong>{String(count)}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.customization_details && (
                      <div>
                        <span className="text-xs uppercase font-semibold text-lucky-mutedText block mb-1">
                          Embellishment & Customization Notes
                        </span>
                        <p className="text-xs text-lucky-dark bg-white p-2.5 rounded-lg border border-lucky-borderLight">
                          {item.customization_details}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-lucky-mutedText">No item details recorded.</p>
              )}
            </CardContent>
          </Card>

          {/* Attachments Card */}
          <Card>
            <CardHeader>
              <CardTitle>Client Uploaded Attachments ({attachmentsWithSignedUrls.length})</CardTitle>
              <CardDescription>
                High-resolution logos, artwork tech packs, and placement guides.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attachmentsWithSignedUrls.length > 0 ? (
                <div className="divide-y divide-lucky-borderLight">
                  {attachmentsWithSignedUrls.map((att: any) => (
                    <div
                      key={att.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FileText className="w-5 h-5 text-lucky-blue shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-lucky-dark truncate">
                            {att.file_name}
                          </p>
                          <span className="text-xs text-lucky-mutedText">
                            {(att.file_size / 1024).toFixed(1)} KB • {att.mime_type}
                          </span>
                        </div>
                      </div>
                      {att.downloadUrl ? (
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={att.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={att.file_name}
                          >
                            <Download className="w-4 h-4 mr-1" /> Download
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-lucky-mutedText">Link expired</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-lucky-mutedText py-2">
                  No design attachments were submitted with this quotation request.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-lucky-blue" />
                <span>Internal Team Notes</span>
              </CardTitle>
              <CardDescription>
                Private notes visible only to Lucky Fashion administrators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={addNote} className="space-y-2">
                <textarea
                  name="content"
                  required
                  rows={2}
                  placeholder="Add internal note or estimate record..."
                  className="w-full p-3 text-xs rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                />
                <div className="flex justify-end">
                  <Button size="sm" type="submit">
                    Post Note
                  </Button>
                </div>
              </form>

              {notes && notes.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-lucky-borderLight">
                  {notes.map((n: any) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg bg-slate-50 border border-lucky-borderLight text-xs"
                    >
                      <div className="flex justify-between items-center text-lucky-mutedText mb-1">
                        <span className="font-semibold text-lucky-dark">{n.author_name}</span>
                        <span>{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-lucky-dark">{n.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-lucky-mutedText text-center py-2">
                  No internal notes yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Client & Timeline Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-xs uppercase font-semibold text-lucky-mutedText block">
                  Name
                </span>
                <p className="font-semibold text-lucky-dark">{quote.contact_name}</p>
              </div>

              {quote.company_name && (
                <div>
                  <span className="text-xs uppercase font-semibold text-lucky-mutedText block">
                    Company / Organization
                  </span>
                  <p className="text-lucky-dark">{quote.company_name}</p>
                </div>
              )}

              <div>
                <span className="text-xs uppercase font-semibold text-lucky-mutedText block">
                  Email
                </span>
                <a
                  href={`mailto:${quote.email}`}
                  className="text-lucky-blue hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{quote.email}</span>
                </a>
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-lucky-mutedText block">
                  Phone
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lucky-dark">{quote.phone}</span>
                  {quote.phone && (
                    <a
                      href={`https://wa.me/${quote.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-lucky-borderLight">
                <span className="text-xs uppercase font-semibold text-lucky-mutedText block mb-1">
                  Required Timeline
                </span>
                <div className="flex items-center gap-2 text-lucky-dark">
                  <Calendar className="w-4 h-4 text-lucky-mutedText" />
                  <span>{quote.delivery_timeline || "Standard production lead time"}</span>
                </div>
              </div>

              {quote.delivery_address && (
                <div>
                  <span className="text-xs uppercase font-semibold text-lucky-mutedText block mb-1">
                    Delivery Address
                  </span>
                  <div className="flex items-start gap-2 text-lucky-dark">
                    <MapPin className="w-4 h-4 text-lucky-mutedText shrink-0 mt-0.5" />
                    <span>{quote.delivery_address}</span>
                  </div>
                </div>
              )}

              {quote.additional_notes && (
                <div>
                  <span className="text-xs uppercase font-semibold text-lucky-mutedText block mb-1">
                    Additional Instructions
                  </span>
                  <p className="text-xs text-lucky-dark bg-slate-50 p-2.5 rounded-lg border border-lucky-borderLight">
                    {quote.additional_notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

