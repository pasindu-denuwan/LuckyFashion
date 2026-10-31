import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Layers, Sparkles } from "lucide-react";

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
    .select("id, name, slug, cover_image_url, is_demo")
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-lucky-mutedText hover:text-lucky-blue transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Catalog
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Visual Showcase */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-lucky-borderLight bg-white shadow-sm">
            <OptimizedImage
              src={product.cover_image_url || ""}
              alt={product.name}
              width={800}
              height={600}
              className="w-full h-[450px] object-cover"
            />
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

        {/* Right Column: Garment Specifications & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase text-lucky-blue">
                {product.categories?.name}
              </span>
              {product.is_demo && <Badge variant="sample">Sample</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-lucky-dark">
              {product.name}
            </h1>
          </div>

          <p className="text-sm text-lucky-mutedText leading-relaxed">
            {product.description}
          </p>

          {/* Fabric Details */}
          {product.fabric_details && (
            <div className="p-4 rounded-xl bg-lucky-lightNeutral/50 border border-lucky-borderLight space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-lucky-dark">
                <Layers className="w-4 h-4 text-lucky-blue" />
                <span>Fabric Composition & Weave</span>
              </div>
              <p className="text-xs text-lucky-mutedText leading-relaxed">
                {product.fabric_details}
              </p>
            </div>
          )}

          {/* Available Sizes */}
          {product.available_sizes && product.available_sizes.length > 0 && (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-lucky-dark mb-2">
                Standard Size Matrix
              </span>
              <div className="flex flex-wrap gap-2">
                {product.available_sizes.map((size: string) => (
                  <span
                    key={size}
                    className="px-3 py-1.5 rounded-lg border border-lucky-borderLight bg-white text-xs font-mono font-medium text-lucky-dark"
                  >
                    {size}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-lucky-mutedText mt-1.5">
                Custom grading and oversize specs accommodated upon request.
              </p>
            </div>
          )}

          {/* Available Colorways */}
          {product.available_colors && product.available_colors.length > 0 && (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-lucky-dark mb-2">
                Sample Dye Colorways
              </span>
              <div className="flex flex-wrap gap-2">
                {product.available_colors.map((color: string) => (
                  <span
                    key={color}
                    className="px-3 py-1 rounded-full border border-lucky-borderLight bg-white text-xs text-lucky-dark"
                  >
                    {color}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-lucky-mutedText mt-1.5">
                Pantone matching system (PMS) dyeing available for custom orders.
              </p>
            </div>
          )}

          {/* Primary CTA Box */}
          <div className="pt-6 border-t border-lucky-borderLight space-y-3">
            <Button asChild size="lg" className="w-full text-base font-bold">
              <Link href={`/quote?product=${product.slug}`}>
                Request a Quote for this Garment
              </Link>
            </Button>
            <p className="text-[11px] text-lucky-mutedText text-center">
              Quotes include pricing estimates, sample options, and turnaround timelines. No obligation.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-lucky-borderLight">
          <h3 className="text-xl font-bold font-heading text-lucky-dark mb-6">
            Related Models in {product.categories?.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Card key={rel.id} className="overflow-hidden hover:shadow-sm transition">
                <OptimizedImage
                  src={rel.cover_image_url || ""}
                  alt={rel.name}
                  width={300}
                  height={200}
                  className="h-44 w-full object-cover"
                />
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <CardTitle className="text-sm font-bold">
                      <Link href={`/products/${rel.slug}`} className="hover:text-lucky-blue">
                        {rel.name}
                      </Link>
                    </CardTitle>
                    {rel.is_demo && <Badge variant="sample">Sample</Badge>}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

