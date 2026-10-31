import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, Download, ExternalLink, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default async function AdminQuotationsPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const supabase = createClient();
  const statusFilter = searchParams.status;
  const searchQuery = searchParams.search;

  let query = supabase
    .from("quotations")
    .select("*, quotation_items(count)")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  if (searchQuery) {
    query = query.or(
      `reference_number.ilike.%${searchQuery}%,contact_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%`
    );
  }

  const { data: quotations } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-lucky-dark">
            Quotations Management
          </h1>
          <p className="text-sm text-lucky-mutedText">
            Review incoming custom apparel quotation requests, specifications, and client files.
          </p>
        </div>
        <Button size="sm" variant="outline">
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", "new", "in_review", "estimated", "approved", "rejected", "archived"].map(
          (status) => {
            const isActive =
              (!statusFilter && status === "all") || statusFilter === status;
            return (
              <Link
                key={status}
                href={status === "all" ? "/admin/quotations" : `/admin/quotations?status=${status}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  isActive
                    ? "bg-lucky-dark text-white shadow-sm"
                    : "bg-white text-lucky-mutedText border border-lucky-borderLight hover:bg-slate-50"
                }`}
              >
                {status.replace("_", " ")}
              </Link>
            );
          }
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Quotation Inquiries</CardTitle>
              <CardDescription>
                Assign estimates and communicate with prospective B2B clients.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-lucky-mutedText absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reference or client..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {quotations && quotations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-lucky-borderLight text-xs text-lucky-mutedText uppercase font-semibold">
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Client Contact</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lucky-borderLight">
                  {quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-lucky-blue">
                        <Link
                          href={`/admin/quotations/${q.id}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          {q.reference_number}
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-lucky-dark">{q.contact_name}</div>
                        <div className="text-xs text-lucky-mutedText">{q.company_name || q.email}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-lucky-mutedText">
                        {q.delivery_timeline || "Standard lead time"}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold">
                        {q.quotation_items?.[0]?.count ?? 1} item(s)
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="py-3 px-4 text-xs text-lucky-mutedText">
                        {new Date(q.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`mailto:${q.email}?subject=Lucky Fashion Quotation Reference: ${q.reference_number}`}
                            className="p-1.5 text-lucky-mutedText hover:text-lucky-blue rounded-md hover:bg-slate-100"
                            title="Email Client"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {q.phone && (
                            <a
                              href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-lucky-mutedText hover:text-emerald-600 rounded-md hover:bg-slate-100"
                              title="WhatsApp Client"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/admin/quotations/${q.id}`}>Details</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-lucky-mutedText">
              No quotations found matching your current filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

