import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Plus, CheckCircle, AlertTriangle, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminCompletedOrdersPage() {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from("completed_orders")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-lucky-dark">
            Completed Orders (Portfolio)
          </h1>
          <p className="text-sm text-lucky-mutedText">
            Client case studies, production runs, and craftsmanship showcases.
          </p>
        </div>
        <Button asChild size="sm" variant="default">
          <Link href="/admin/completed-orders/new">
            <Plus className="w-4 h-4 mr-1" /> New Portfolio Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Studies & Portfolio Items</CardTitle>
          <CardDescription>
            Note: Publishing projects containing customer-identifying materials requires verified consent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-lucky-borderLight text-xs text-lucky-mutedText uppercase font-semibold">
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Client Type</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Brand Permission</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lucky-borderLight">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <OptimizedImage
                            src={o.cover_image_url || ""}
                            alt={o.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover border border-lucky-borderLight"
                          />
                          <div>
                            <div className="font-semibold text-lucky-dark flex items-center gap-2">
                              <span>{o.title}</span>
                              {o.is_demo && <Badge variant="sample">Sample</Badge>}
                            </div>
                            <span className="text-xs text-lucky-mutedText font-mono">
                              /{o.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-lucky-mutedText">
                        {o.client_type || "Corporate Client"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">
                          {o.categories?.name || "General"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {o.has_customer_identifying_material ? (
                          o.customer_material_permission ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                              <CheckCircle className="w-3 h-3" /> Permission Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                              <AlertTriangle className="w-3 h-3" /> Pending Consent
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-lucky-mutedText">
                            Generic Materials
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Link href={`/admin/completed-orders/${o.id}/edit`}>
                              <Edit3 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
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
              No completed orders published yet. Showcase previous bulk manufacturing runs here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

