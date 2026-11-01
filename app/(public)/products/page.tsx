import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { EmptyState } from "@/components/ui/empty-state";
import { Shirt, Search, Sparkles, ArrowRight, ArrowUpRight, Filter } from "lucide-react";

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
    name: "Heavyweight Boxy Blank Crewneck",
    slug: "heavyweight-boxy-blank-crewneck",
    description: "240 GSM luxury ring-spun combed cotton with relaxed drop-shoulder silhouette, 1x1 tight rib collar, and twin-needle hems.",
    category_name: "T-Shirts",
    category_slug: "t-shirts",
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    cover_image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    weight_gsm: "240",
    fabric_blend: "100% Combed Cotton",
  },
  {
    id: "p2",
    name: "Classic Ring-Spun Daily Tee",
    slug: "classic-ring-spun-daily-tee",
    description: "180 GSM mid-weight combed cotton t-shirt with reinforced shoulder-to-shoulder herringbone taping and side seams.",
    category_name: "T-Shirts",
    category_slug: "t-shirts",
    available_sizes: ["S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    weight_gsm: "180",
    fabric_blend: "100% Cotton",
  },
  {
    id: "p3",
    name: "Premium Honeycomb Pique Corporate Polo",
    slug: "premium-pique-corporate-polo",
    description: "220 GSM heavyweight cotton-poly blend pique with reinforced two-button placket, flat-knit ribbed collar, and side vents.",
    category_name: "Polo Shirts",
    category_slug: "polo-shirts",
    available_sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    cover_image_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    weight_gsm: "220",
    fabric_blend: "65/35 Cotton-Poly",
  },
  {
    id: "p4",
    name: "Ultra-Heavy Brushed Fleece Pullover Hoodie",
    slug: "heavyweight-brushed-fleece-pullover-hoodie",
    description: "360 GSM heavyweight fleece hoodie with double-layer 3-piece hood, concealed kangaroo pocket, and matching round drawstrings.",
    category_name: "Hoodies & Sweatshirts",
    category_slug: "hoodies-sweatshirts",
    available_sizes: ["S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    weight_gsm: "360",
    fabric_blend: "80/20 Cotton-Poly Fleece",
  },
  {
    id: "p5",
    name: "French Terry Athletic Crewneck Sweatshirt",
    slug: "french-terry-athletic-crewneck-sweatshirt",
    description: "320 GSM unbrushed loopback French terry with ribbed V-notch insert at neck and spandex-reinforced cuffs and hem.",
    category_name: "Hoodies & Sweatshirts",
    category_slug: "hoodies-sweatshirts",
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    weight_gsm: "320",
    fabric_blend: "100% French Terry Cotton",
  },
  {
    id: "p6",
    name: "Dry-Fit Micro-Interlock Performance Tee",
    slug: "dry-fit-athletic-performance-tee",
    description: "150 GSM lightweight micro-interlock fabric designed for maximum moisture transport, athletic stretch, and rapid drying.",
    category_name: "Sportswear & Activewear",
    category_slug: "sportswear-activewear",
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    weight_gsm: "150",
    fabric_blend: "100% Dry-Fit Poly",
  },
  {
    id: "p7",
    name: "Enterprise Staff Utility Workshirt",
    slug: "enterprise-staff-utility-workshirt",
    description: "200 GSM rugged cotton-twill shirting with dual chest flap pockets, reinforced shoulder yoke, and pen slots.",
    category_name: "Corporate Uniforms",
    category_slug: "corporate-uniforms",
    available_sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    cover_image_url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    weight_gsm: "200",
    fabric_blend: "Cotton Twill",
  },
  {
    id: "p8",
    name: "Structured 6-Panel Cotton Twill Cap",
    slug: "structured-6-panel-cotton-twill-cap",
    description: "Heavy brushed cotton twill with buckram-backed front panels, stitched eyelets, and adjustable brass buckle slider.",
    category_name: "Caps & Headwear",
    category_slug: "caps-headwear",
    available_sizes: ["One Size Fits All"],
    cover_image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    weight_gsm: "Heavy Twill",
    fabric_blend: "100% Cotton Chino",
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
        weight_gsm: p.weight_gsm ? `${p.weight_gsm}` : "Custom",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Editorial Header */}
      <div className="rounded-3xl bg-gradient-to-r from-lucky-dark to-lucky-darkCard p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border border-purple-900/60">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lucky-cream/20 text-lucky-cream text-xs font-bold border border-lucky-cream/30">
            <Sparkles className="w-3.5 h-3.5 text-lucky-cream" />
            <span>Field-Tested Apparel Blanks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            Garment Foundations & Silhouette Matrix
          </h1>
          <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
            High-specification blanks engineered for custom reactive dyeing, precision silkscreening, 3D embroidery, and private labeling. All silhouettes available for bulk contract manufacturing.
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-lucky-magenta/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-lucky-magenta" />
            <span className="text-xs uppercase font-bold tracking-wider text-lucky-mutedText">
              Filter by Silhouette
            </span>
          </div>

          {/* Search Form */}
          <form method="GET" action="/products" className="relative w-full sm:w-72">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery || ""}
              placeholder="Search silhouette or GSM..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-magenta"
            />
            <Search className="w-4 h-4 text-lucky-mutedText absolute left-3 top-2.5" />
            {selectedCategory && (
              <input type="hidden" name="category" value={selectedCategory} />
            )}
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !selectedCategory
                ? "bg-lucky-dark text-lucky-cream shadow-xs"
                : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-lucky-lightNeutral"
            }`}
          >
            All Silhouettes
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.slug
                  ? "bg-lucky-dark text-lucky-cream shadow-xs"
                  : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-lucky-lightNeutral"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl bg-white border border-lucky-borderLight shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-lucky-lightNeutral/40">
                  <OptimizedImage
                    src={p.cover_image_url || ""}
                    alt={p.name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-lucky-magenta border border-lucky-borderLight shadow-xs">
                      {p.category_name}
                    </span>
                  </div>
                  {p.is_demo && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="sample" className="bg-white/95">
                        Sample
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-5 pb-2">
                  <h3 className="font-heading font-bold text-base text-lucky-dark group-hover:text-lucky-magenta transition-colors line-clamp-1">
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </h3>
                  <p className="text-xs text-lucky-mutedText mt-1.5 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-lucky-borderLight/80 flex flex-wrap gap-1.5">
                    {p.weight_gsm && (
                      <span className="text-[10px] font-semibold text-lucky-dark bg-lucky-cream/60 px-2 py-0.5 rounded-md border border-lucky-borderLight">
                        {p.weight_gsm} GSM
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-lucky-mutedText bg-lucky-lightNeutral px-2 py-0.5 rounded-md">
                      Sizes: {p.available_sizes?.slice(0, 3).join(", ")}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Always "Request a Quote" CTA */}
              <div className="p-5 pt-3 border-t border-lucky-borderLight flex items-center justify-between gap-2">
                <Link
                  href={`/products/${p.slug}`}
                  className="text-xs font-semibold text-lucky-mutedText hover:text-lucky-magenta transition flex items-center gap-0.5"
                >
                  <span>Specs</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <Button asChild size="sm" variant="default" className="shadow-xs">
                  <Link href={`/quote?product=${p.slug}`}>
                    Request a Quote
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Garments Found"
          description="There are currently no published models under the selected filter criteria."
          icon={Shirt}
          actionLabel="Show All Garments"
          actionHref="/products"
        />
      )}
    </div>
  );
}
