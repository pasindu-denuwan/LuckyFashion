import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ArrowRight, Layers, CheckCircle2, ShieldCheck, Sparkles, Factory, ArrowUpRight } from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();

  const [
    { data: contentRecord },
    { data: categories },
    { data: featuredProducts },
    { data: featuredProjects },
  ] = await Promise.all([
    supabase.from("website_content").select("content").eq("page_key", "home").single(),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order").limit(6),
    supabase.from("products").select("*, categories(name)").eq("status", "published").eq("featured", true).limit(4),
    supabase.from("completed_orders").select("*, categories(name)").eq("status", "published").eq("featured", true).limit(3),
  ]);

  const content = contentRecord?.content || {};
  const heroTitle = content.hero_title || "Precision Custom Apparel Manufacturing";
  const heroSubtitle =
    content.hero_subtitle ||
    "Lucky Fashion engineers high-performance blanks, corporate uniforms, and customized garments for brands and organizations.";

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-lucky-offwhite pt-16 pb-20 border-b border-lucky-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lucky-lightNeutral text-xs font-semibold text-lucky-mutedText mb-6 border border-lucky-borderLight">
              <Sparkles className="w-3.5 h-3.5 text-lucky-blue" />
              <span>B2B Contract Manufacturing & Bulk Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold font-heading text-lucky-dark tracking-tight leading-[1.1] mb-6">
              {heroTitle}
            </h1>

            <p className="text-lg text-lucky-mutedText leading-relaxed mb-8 max-w-2xl">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" variant="default">
                <Link href="/quote">
                  Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/products">Explore Catalog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Process & Capabilities Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Layers,
              title: "Custom Fabrics & Blends",
              description: "Direct mill sourcing across combed cottons, interlock, poly-spandex, and dry-fit performance knits.",
            },
            {
              icon: Factory,
              title: "Modern Cut & Sew",
              description: "Laser cutting, precision pattern plotting, and automated seam joining for zero-defect consistency.",
            },
            {
              icon: Sparkles,
              title: "Advanced Embellishment",
              description: "High-density embroidery, water-based discharge screen printing, silicone transfers, and custom trims.",
            },
            {
              icon: ShieldCheck,
              title: "AQL 2.5 Inspection",
              description: "Systematic multi-stage quality checkpoints from raw yarn inspection to carton packaging.",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-lucky-lightNeutral flex items-center justify-center text-lucky-blue">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-lucky-dark">
                  {item.title}
                </h3>
                <p className="text-xs text-lucky-mutedText leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold font-heading text-lucky-dark">
              Core Apparel Categories
            </h2>
            <p className="text-sm text-lucky-mutedText mt-1">
              Engineered garment foundations available for bulk manufacturing and customization.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/products" className="inline-flex items-center gap-1 font-semibold text-lucky-blue">
              All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm hover:shadow-md hover:border-lucky-blue/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono text-lucky-mutedText font-semibold">
                      0{cat.sort_order}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-lucky-mutedText group-hover:text-lucky-blue transition" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-lucky-dark group-hover:text-lucky-blue transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-lucky-mutedText mt-2 leading-relaxed">
                    {cat.description || "Custom specifications, dyeing, and branding options available."}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-xs font-semibold text-lucky-dark group-hover:text-lucky-blue transition">
                    View Line
                  </span>
                  {cat.is_demo && <Badge variant="sample">Sample</Badge>}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-sm text-lucky-mutedText">
              Catalog categories will appear once populated in the admin portal.
            </div>
          )}
        </div>
      </section>

      {/* 4. Featured Products Showcase */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold font-heading text-lucky-dark">
                Featured Apparel Models
              </h2>
              <p className="text-sm text-lucky-mutedText mt-1">
                Field-tested blank profiles ready for custom dyeing, printing, and brand labeling.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/products" className="inline-flex items-center gap-1 font-semibold text-lucky-blue">
                View All Models <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <Card key={p.id} className="overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <OptimizedImage
                    src={p.cover_image_url || ""}
                    alt={p.name}
                    width={400}
                    height={280}
                    className="h-52 w-full object-cover"
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
                    Sizes: {p.available_sizes?.slice(0, 3).join(", ")}...
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
        </section>
      )}

      {/* 5. Featured Portfolio / Completed Orders */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="bg-lucky-dark text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-lucky-blue">
                  Proven Delivery
                </span>
                <h2 className="text-3xl font-bold font-heading text-white mt-1">
                  Recent Completed Orders
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Excellence demonstrated across corporate rollouts, sports tournaments, and enterprise uniform programs.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-800">
                <Link href="/our-work">View All Work</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-lucky-darkCard border border-slate-800 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <OptimizedImage
                      src={proj.cover_image_url || ""}
                      alt={proj.title}
                      width={500}
                      height={320}
                      className="h-56 w-full object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>{proj.client_type || "Corporate Client"}</span>
                        {proj.is_demo && <Badge variant="sample">Sample</Badge>}
                      </div>
                      <h3 className="text-lg font-bold font-heading text-white mb-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Button asChild size="sm" variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
                      <Link href={`/our-work/${proj.slug}`}>Inspect Project Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Request a Quote Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-lucky-blue p-8 sm:p-14 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight mb-3">
              Ready to Manufacture Your Custom Garments?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Submit your required quantities, fabric preferences, and branding requirements through our quotation portal. Our technical team prepares formal specifications within 24 to 48 hours.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-lucky-blue hover:bg-slate-100 font-bold shrink-0">
            <Link href="/quote">Request a Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

