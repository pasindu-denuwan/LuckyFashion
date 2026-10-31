import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderTree, Edit2, Trash2 } from "lucide-react";

export default async function AdminCategoriesPage() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-lucky-dark">
            Product Categories
          </h1>
          <p className="text-sm text-lucky-mutedText">
            Manage active apparel lines, display order, and navigation tags.
          </p>
        </div>
        <Button size="sm" variant="default">
          <Plus className="w-4 h-4 mr-1" /> New Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog Categories</CardTitle>
          <CardDescription>
            Categories group blanks and customizable garment styles across the catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories && categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-lucky-borderLight text-xs text-lucky-mutedText uppercase font-semibold">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Products</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lucky-borderLight">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono text-lucky-mutedText">
                        #{c.sort_order}
                      </td>
                      <td className="py-3 px-4 font-medium text-lucky-dark">
                        <div className="flex items-center gap-2">
                          <span>{c.name}</span>
                          {c.is_demo && <Badge variant="sample">Sample</Badge>}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-lucky-mutedText">
                        {c.slug}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">
                          {c.products?.[0]?.count ?? 0} items
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            c.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {c.is_active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit2 className="w-4 h-4" />
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
              No categories configured yet. Add your apparel lines to begin organizing products.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

