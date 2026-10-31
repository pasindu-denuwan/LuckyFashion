import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Plus, Search, Edit3, Trash2, Copy } from "lucide-react";
import Link from "next/link";

export default async function AdminProductsPage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-lucky-dark">
            Product Catalog
          </h1>
          <p className="text-sm text-lucky-mutedText">
            Manage garment models, fabrics, colorways, and publication status.
          </p>
        </div>
        <Button asChild size="sm" variant="default">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Catalog Items</CardTitle>
              <CardDescription>
                B2B garment styles available for bulk quote requests.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-lucky-mutedText absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-lucky-borderLight text-xs text-lucky-mutedText uppercase font-semibold">
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Sizes</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lucky-borderLight">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <OptimizedImage
                            src={p.cover_image_url || ""}
                            alt={p.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover border border-lucky-borderLight"
                          />
                          <div>
                            <div className="font-semibold text-lucky-dark flex items-center gap-2">
                              <span>{p.name}</span>
                              {p.is_demo && <Badge variant="sample">Sample</Badge>}
                            </div>
                            <span className="text-xs text-lucky-mutedText font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">
                          {p.categories?.name || "Uncategorized"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-lucky-mutedText">
                        {p.available_sizes?.join(", ") || "Custom sizes"}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3 px-4">
                        {p.featured ? (
                          <span className="text-xs font-semibold text-lucky-blue bg-blue-50 px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-lucky-mutedText">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Link href={`/admin/products/${p.id}/edit`}>
                              <Edit3 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lucky-mutedText hover:text-lucky-dark">
                            <Copy className="w-4 h-4" />
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
              No products found. Add custom apparel models to your catalog.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

