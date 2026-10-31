import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Mail,
  Shirt,
  CheckCircle2,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  // Fetch count aggregations with graceful fallbacks
  const [
    { count: quotesCount },
    { count: messagesCount },
    { count: productsCount },
    { count: ordersCount },
    { data: recentQuotations },
  ] = await Promise.all([
    supabase.from("quotations").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("completed_orders").select("*", { count: "exact", head: true }),
    supabase
      .from("quotations")
      .select("id, reference_number, contact_name, company_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const metrics = [
    {
      title: "Total Quotations",
      value: quotesCount ?? 0,
      description: "Customer quote requests",
      icon: FileSpreadsheet,
      href: "/admin/quotations",
    },
    {
      title: "Active Messages",
      value: messagesCount ?? 0,
      description: "Inquiries awaiting response",
      icon: Mail,
      href: "/admin/messages",
    },
    {
      title: "Products in Catalog",
      value: productsCount ?? 0,
      description: "Apparel models and blanks",
      icon: Shirt,
      href: "/admin/products",
    },
    {
      title: "Completed Projects",
      value: ordersCount ?? 0,
      description: "Public portfolio case studies",
      icon: CheckCircle2,
      href: "/admin/completed-orders",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-lucky-dark">
            Production Overview
          </h1>
          <p className="text-sm text-lucky-mutedText">
            Real-time status of quotation requests, manufacturing inquiries, and catalog.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href="/admin/quotations">Review Quotes</Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.title} className="hover:shadow-md transition">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-lucky-mutedText">
                    {m.title}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-lucky-lightNeutral flex items-center justify-center text-lucky-dark">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-heading mt-2 text-lucky-dark">
                  {m.value}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="text-lucky-mutedText">{m.description}</span>
                  <Link
                    href={m.href}
                    className="text-lucky-blue font-semibold hover:underline inline-flex items-center"
                  >
                    View <ArrowRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Quotations Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Quotation Submissions</CardTitle>
            <CardDescription>
              Incoming requests assigned official reference numbers.
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/quotations">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentQuotations && recentQuotations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-lucky-borderLight text-xs text-lucky-mutedText uppercase font-semibold">
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lucky-borderLight">
                  {recentQuotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-medium text-lucky-dark">
                        {q.reference_number}
                      </td>
                      <td className="py-3 px-4 font-medium text-lucky-dark">
                        {q.contact_name}
                      </td>
                      <td className="py-3 px-4 text-lucky-mutedText">
                        {q.company_name || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="py-3 px-4 text-xs text-lucky-mutedText">
                        {new Date(q.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/quotations/${q.id}`}>Inspect</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-lucky-mutedText">
              No quotations received yet. Incoming requests submitted through the quote form will appear here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

