import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Shirt } from "lucide-react";

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const supabase = createClient();
  const selectedCategory = searchParams.category;
  const searchQuery = searchParams.search;

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    (() => {
      let q = supabase
        .from("products")
        .select("*, categories!inner(name, slug)")
        .eq("status", "published");

      if (selectedCategory) {
        q = q.eq("categories.slug", selectedCategory);
      }
      if (searchQuery) {
        q = q.ilike("name", `%${searchQuery}%`);
      }
      return q.order("created_at", { ascending: false });
    })(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold font-heading text-lucky-dark">
          Apparel Catalog & Garment Blanks
        </h1>
        <p className="text-sm text-lucky-mutedText mt-2 max-w-2xl">
          High-specification blanks and custom silhouette options for corporate wear, sportswear, polo shirts, and casual collections.
        </p>
      </div>

      {/* Categories Bar & Search Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-lucky-borderLight pb-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              !selectedCategory
                ? "bg-lucky-dark text-white"
                : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-slate-50"
            }`}
          >
            All Lines
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat.slug
                  ? "bg-lucky-dark text-white"
                  : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Card key={p.id} className="flex flex-col justify-between overflow-hidden hover:shadow-md transition">
              <div>
                <OptimizedImage
                  src={p.cover_image_url || ""}
                  alt={p.name}
                  width={400}
                  height={280}
                  className="h-56 w-full object-cover"
                />
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-lucky-blue uppercase">
                      {p.categories?.name}
                    </span>
                    {p.is_demo && <Badge variant="sample">Sample</Badge>}
                  </div>
                  <CardTitle className="text-base leading-snug">
                    <Link href={`/products/${p.slug}`} className="hover:text-lucky-blue transition">
                      {p.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">
                    {p.description}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardFooter className="p-5 pt-3 border-t border-lucky-borderLight flex justify-between items-center">
                <span className="text-xs text-lucky-mutedText">
                  {p.available_sizes?.length ? `${p.available_sizes.length} sizes` : "Custom sizes"}
                </span>
                <Button asChild size="sm" variant="default">
                  <Link href={`/quote?product=${p.slug}`}>
                    Request a Quote
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Products in This Category"
          description="There are currently no published models under the selected filter criteria."
          icon={Shirt}
          actionLabel="Show All Products"
          onAction={() => {}}
        />
      )}
    </div>
  );
}

