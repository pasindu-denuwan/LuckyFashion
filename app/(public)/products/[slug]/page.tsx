import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Printer,
} from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!product) {
    return { title: "Product Not Found | Lucky Fashion" };
  }

  return {
    title: `${product.name} | Lucky Fashion Custom Apparel`,
    description: product.description || "Custom manufactured garment blanks from Lucky Fashion.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name, slug), product_images(*)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, name, slug, cover_image_url, is_demo, weight_gsm")
    .eq("category_id", product.category_id)
    .eq("status", "published")
    .neq("id", product.id)
    .limit(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-lucky-mutedText hover:text-lucky-magenta transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Catalog
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Visual Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl overflow-hidden border border-lucky-borderLight bg-white shadow-sm relative">
            <OptimizedImage
              src={product.cover_image_url || ""}
              alt={product.name}
              width={800}
              height={600}
              className="w-full h-[480px] object-cover"
              priority
            />
            {product.is_demo && (
              <div className="absolute top-4 right-4">
                <Badge variant="sample" className="bg-white/95 shadow-xs">
                  Sample
                </Badge>
              </div>
            )}
          </div>

          {/* Product Gallery Images (if any) */}
          {product.product_images && product.product_images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.product_images.map((img: any) => (
                <div
                  key={img.id}
                  className="w-20 h-20 rounded-xl overflow-hidden border border-lucky-borderLight shrink-0"
                >
                  <OptimizedImage
                    src={img.url}
                    alt={img.alt_text || product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Garment Specifications & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-lucky-magenta">
                {product.categories?.name || "Apparel"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-lucky-dark">
              {product.name}
            </h1>
          </div>

          <p className="text-sm text-lucky-mutedText leading-relaxed">
            {product.description}
          </p>

          {/* Technical Specs Card */}
          <div className="p-5 rounded-2xl bg-white border border-lucky-borderLight shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-lucky-dark pb-2 border-b border-lucky-borderLight">
              <Layers className="w-4 h-4 text-lucky-magenta" />
              <span>Garment Specifications</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-lucky-mutedText block">
                  Fabric Weight
                </span>
                <span className="font-bold text-lucky-dark text-sm">
                  {product.weight_gsm ? `${product.weight_gsm} GSM` : "180 - 240 GSM"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-lucky-mutedText block">
                  Composition
                </span>
                <span className="font-bold text-lucky-dark text-sm">
                  {product.fabric_blend || "100% Ring-Spun Cotton"}
                </span>
              </div>
            </div>

            {product.fabric_details && (
              <div className="pt-2 border-t border-lucky-borderLight/80">
                <span className="text-[10px] uppercase font-bold text-lucky-mutedText block mb-1">
                  Weave & Finish
                </span>
                <p className="text-lucky-mutedText leading-relaxed">
                  {product.fabric_details}
                </p>
              </div>
            )}
          </div>

          {/* Sizing Matrix */}
          {product.available_sizes && product.available_sizes.length > 0 && (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-lucky-dark mb-2">
                Available Size Run
              </span>
              <div className="flex flex-wrap gap-2">
                {product.available_sizes.map((size: string) => (
                  <span
                    key={size}
                    className="px-3 py-1.5 rounded-lg border border-lucky-borderLight bg-white text-xs font-mono font-bold text-lucky-dark"
                  >
                    {size}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-lucky-mutedText mt-1.5">
                Custom sizing grading, oversized fits, and extended sizes accommodated on request.
              </p>
            </div>
          )}

          {/* Production Reassurance Callout */}
          <div className="p-4 rounded-xl bg-lucky-cream/40 border border-lucky-borderLight space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-lucky-dark">
              <ShieldCheck className="w-4 h-4 text-lucky-magenta shrink-0" />
              <span>Pre-Production Sample Sign-Off</span>
            </div>
            <p className="text-lucky-mutedText text-[11px] leading-relaxed">
              We fabricate a complete physical prototype for your hands-on touch, fit, and color approval before commencing bulk cutting.
            </p>
          </div>

          {/* Primary CTA Box */}
          <div className="pt-4 border-t border-lucky-borderLight space-y-3">
            <Button asChild size="lg" variant="default" className="w-full text-base font-bold shadow-md">
              <Link href={`/quote?product=${product.slug}`} className="flex items-center justify-center gap-2">
                <span>Request a Quote for this Garment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <p className="text-[11px] text-lucky-mutedText text-center">
              Our technical desk prepares formal specifications within 24 to 48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-lucky-borderLight">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-heading text-lucky-dark">
              Related Silhouettes in {product.categories?.name}
            </h3>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/products?category=${product.categories?.slug}`} className="text-xs font-bold text-lucky-magenta">
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="group rounded-2xl bg-white border border-lucky-borderLight overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-lucky-lightNeutral/40">
                    <OptimizedImage
                      src={rel.cover_image_url || ""}
                      alt={rel.name}
                      width={300}
                      height={220}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {rel.is_demo && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="sample" className="bg-white/95">
                          Sample
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading font-bold text-sm text-lucky-dark group-hover:text-lucky-magenta transition-colors line-clamp-1">
                      <Link href={`/products/${rel.slug}`}>{rel.name}</Link>
                    </h4>
                  </div>
                </div>
                <div className="p-4 pt-0 flex items-center justify-between">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href={`/products/${rel.slug}`}>View Spec</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
