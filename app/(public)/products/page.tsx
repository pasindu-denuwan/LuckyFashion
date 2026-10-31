import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { EmptyState } from "@/components/ui/empty-state";
import { Shirt } from "lucide-react";

const SAMPLE_CATEGORIES = [
  { id: "1", name: "T-Shirts", slug: "t-shirts", sort_order: 1 },
  { id: "2", name: "Polo Shirts", slug: "polo-shirts", sort_order: 2 },
  { id: "3", name: "Hoodies & Sweatshirts", slug: "hoodies-sweatshirts", sort_order: 3 },
  { id: "4", name: "Corporate Uniforms", slug: "corporate-uniforms", sort_order: 4 },
  { id: "5", name: "Sportswear & Activewear", slug: "sportswear-activewear", sort_order: 5 },
  { id: "6", name: "Caps & Headwear", slug: "caps-headwear", sort_order: 6 },
];

const SAMPLE_PRODUCTS = [
  {
    id: "p1",
    name: "Classic Combed Cotton Crewneck",
    slug: "classic-combed-cotton-crewneck",
    description: "180 GSM ring-spun combed cotton t-shirt with reinforced twin-needle stitching and ribbed collar.",
    category_name: "T-Shirts",
    category_slug: "t-shirts",
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
  },
  {
    id: "p2",
    name: "Premium Pique Corporate Polo",
    slug: "premium-pique-corporate-polo",
    description: "220 GSM heavyweight cotton-poly blend pique with custom dye-to-match buttons and flat-knit collar.",
    category_name: "Polo Shirts",
    category_slug: "polo-shirts",
    available_sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    cover_image_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
  },
  {
    id: "p3",
    name: "Heavyweight Brushed Fleece Pullover Hoodie",
    slug: "heavyweight-brushed-fleece-pullover-hoodie",
    description: "340 GSM luxury fleece hoodie with kangaroo pocket, double-lined hood, and matching drawstrings.",
    category_name: "Hoodies & Sweatshirts",
    category_slug: "hoodies-sweatshirts",
    available_sizes: ["S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
  },
  {
    id: "p4",
    name: "Dry-Fit Athletic Performance Tee",
    slug: "dry-fit-athletic-performance-tee",
    description: "150 GSM lightweight micro-interlock fabric designed for maximum breathability and rapid drying.",
    category_name: "Sportswear & Activewear",
    category_slug: "sportswear-activewear",
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
  },
  {
    id: "p5",
    name: "Tailored Oxford Corporate Uniform Shirt",
    slug: "tailored-oxford-corporate-uniform-shirt",
    description: "Structured Oxford weave button-down uniform shirt built for daily comfort and long-wearing durability.",
    category_name: "Corporate Uniforms",
    category_slug: "corporate-uniforms",
    available_sizes: ["S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
  },
];

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const selectedCategory = searchParams.category;
  const searchQuery = searchParams.search;

  let categories = SAMPLE_CATEGORIES;
  let products = SAMPLE_PRODUCTS;

  try {
    const supabase = createClient();
    const [catRes, prodRes] = await Promise.all([
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

    if (catRes.data && catRes.data.length > 0) {
      categories = catRes.data;
    }
    if (prodRes.data && prodRes.data.length > 0) {
      products = prodRes.data.map((p) => ({
        ...p,
        category_name: p.categories?.name,
        category_slug: p.categories?.slug,
      }));
    } else if (selectedCategory) {
      products = SAMPLE_PRODUCTS.filter((p) => p.category_slug === selectedCategory);
    }
  } catch {
    if (selectedCategory) {
      products = SAMPLE_PRODUCTS.filter((p) => p.category_slug === selectedCategory);
    }
  }

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

      {/* Categories Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-lucky-borderLight pb-4">
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
          {categories.map((cat) => (
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
                      {p.category_name}
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
