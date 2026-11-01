import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Factory,
  CheckCircle2,
  Users,
  Building2,
  Trophy,
  Flame,
  Printer,
  Scissors,
  Palette,
  PackageCheck,
  FileCheck,
  Clock,
  ArrowUpRight,
} from "lucide-react";

import { HeroGarmentShowcase } from "@/components/public/hero-garment-showcase";
import { QuickQuoteCalculator } from "@/components/public/quick-quote-calculator";
import { BlankCatalogFilter, type BlankProductItem } from "@/components/public/blank-catalog-filter";
import { FabricLabExplorer } from "@/components/public/fabric-lab-explorer";

const FALLBACK_CATEGORIES = [
  { id: "1", name: "T-Shirts", slug: "t-shirts", description: "Crewneck, oversized, and heavy drop-shoulder silhouettes engineered for retail collections and bulk branding.", sort_order: 1, is_demo: true },
  { id: "2", name: "Polo Shirts", slug: "polo-shirts", description: "Classic honeycomb pique and smooth interlock knit polos with custom plackets and embroidered insignia.", sort_order: 2, is_demo: true },
  { id: "3", name: "Hoodies & Fleece", slug: "hoodies-sweatshirts", description: "Heavyweight 360+ GSM fleece and loopback French terry pullovers, zip-ups, and crewnecks.", sort_order: 3, is_demo: true },
  { id: "4", name: "Corporate Uniforms", slug: "corporate-uniforms", description: "Durable, tailored work shirts, twill trousers, aprons, and outerwear for hospitality and corporate fleets.", sort_order: 4, is_demo: true },
  { id: "5", name: "Sportswear & Activewear", slug: "sportswear-activewear", description: "High-performance moisture-wicking tees, training singlets, and track jackets engineered for athletic motion.", sort_order: 5, is_demo: true },
  { id: "6", name: "Caps & Headwear", slug: "caps-headwear", description: "Structured 6-panel snapbacks, dad caps, and bucket hats built with heavy cotton twill.", sort_order: 6, is_demo: true },
];

const FALLBACK_PRODUCTS: BlankProductItem[] = [
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
    gsm: "240 GSM",
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
    gsm: "180 GSM",
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
    gsm: "220 GSM",
    fabric_blend: "65/35 Cotton-Poly",
  },
  {
    id: "p4",
    name: "Ultra-Heavy Brushed Fleece Pullover Hoodie",
    slug: "heavyweight-brushed-fleece-pullover-hoodie",
    description: "360 GSM heavyweight fleece hoodie with double-layer 3-piece hood, concealed kangaroo pocket, and matching round drawstrings.",
    category_name: "Hoodies & Fleece",
    category_slug: "hoodies-sweatshirts",
    available_sizes: ["S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    gsm: "360 GSM",
    fabric_blend: "80/20 Cotton-Poly Fleece",
  },
  {
    id: "p5",
    name: "French Terry Athletic Crewneck Sweatshirt",
    slug: "french-terry-athletic-crewneck-sweatshirt",
    description: "320 GSM unbrushed loopback French terry with ribbed V-notch insert at neck and spandex-reinforced cuffs and hem.",
    category_name: "Hoodies & Fleece",
    category_slug: "hoodies-sweatshirts",
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    gsm: "320 GSM",
    fabric_blend: "100% French Terry Cotton",
  },
  {
    id: "p6",
    name: "Dry-Fit Micro-Interlock Performance Tee",
    slug: "dry-fit-athletic-performance-tee",
    description: "150 GSM lightweight micro-interlock fabric designed for maximum moisture transport, athletic stretch, and rapid drying.",
    category_name: "Sportswear",
    category_slug: "sportswear-activewear",
    available_sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    cover_image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    gsm: "150 GSM",
    fabric_blend: "100% Dry-Fit Poly",
  },
  {
    id: "p7",
    name: "Enterprise Staff Utility Workshirt",
    slug: "enterprise-staff-utility-workshirt",
    description: "200 GSM rugged cotton-twill shirting with dual chest flap pockets, reinforced shoulder yoke, and pen slots.",
    category_name: "Corporate Wear",
    category_slug: "corporate-uniforms",
    available_sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    cover_image_url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    gsm: "200 GSM",
    fabric_blend: "Cotton Twill",
  },
  {
    id: "p8",
    name: "Structured 6-Panel Cotton Twill Cap",
    slug: "structured-6-panel-cotton-twill-cap",
    description: "Heavy brushed cotton twill with buckram-backed front panels, stitched eyelets, and adjustable brass buckle slider.",
    category_name: "Headwear",
    category_slug: "caps-headwear",
    available_sizes: ["One Size Fits All"],
    cover_image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    gsm: "Heavy Twill",
    fabric_blend: "100% Cotton Chino",
  },
];

const FALLBACK_PROJECTS = [
  {
    id: "o1",
    title: "National Multi-City Staff Uniform Rollout",
    slug: "national-staff-uniform-rollout",
    client_type: "Corporate Enterprise",
    batch_size: "3,200 Garments",
    description: "Custom-dyed pique polo shirts with 12,000-stitch high-density corporate chest embroidery and dye-matched sleeve tipping.",
    cover_image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    specs: ["Custom Pantone Dye", "Tajima Embroidery", "Individual Polybagging"],
  },
  {
    id: "o2",
    title: "Metropolitan Marathon Finisher Tech Kits",
    slug: "metropolitan-marathon-finisher-tech-kits",
    client_type: "Athletic Event Institution",
    batch_size: "8,500 Garments",
    description: "Ultra-breathable 150 GSM moisture-wicking jerseys with reflective safety heat transfers and soft-hand sublimation side panels.",
    cover_image_url: "https://images.unsplash.com/photo-1508215885820-4523e431397e?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    specs: ["Moisture-Wicking Interlock", "Reflective 3M Transfers", "AQL 2.5 Audit"],
  },
  {
    id: "o3",
    title: "Streetwear Label Heavyweight Drop",
    slug: "streetwear-label-heavyweight-drop",
    client_type: "Private Fashion Brand",
    batch_size: "1,200 Garments",
    description: "240 GSM oversized boxy crewneck t-shirts paired with 380 GSM brushed fleece hoodies featuring water-based discharge prints and custom damask neck labels.",
    cover_image_url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
    specs: ["240 GSM Boxy Tee", "Discharge Screen Print", "Custom Woven Neck Labels"],
  },
];

export default async function HomePage() {
  let content: Record<string, string> = {};
  let displayProducts: BlankProductItem[] = FALLBACK_PRODUCTS;
  let displayProjects = FALLBACK_PROJECTS;

  try {
    const supabase = createClient();
    const [
      { data: contentRecord },
      { data: featuredProducts },
      { data: featuredProjects },
    ] = await Promise.all([
      supabase.from("website_content").select("content").eq("page_key", "home").single(),
      supabase.from("products").select("*, categories(name, slug)").eq("status", "published").eq("featured", true).limit(8),
      supabase.from("completed_orders").select("*, categories(name)").eq("status", "published").eq("featured", true).limit(3),
    ]);

    if (contentRecord?.content) content = contentRecord.content;
    if (featuredProducts && featuredProducts.length > 0) {
      displayProducts = featuredProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category_name: p.categories?.name || "Apparel",
        category_slug: p.categories?.slug || "t-shirts",
        available_sizes: p.available_sizes || ["S", "M", "L", "XL"],
        cover_image_url: p.cover_image_url || "",
        is_demo: Boolean(p.is_demo),
        gsm: p.weight_gsm ? `${p.weight_gsm} GSM` : "Custom Weight",
        fabric_blend: p.fabric_blend || "Combed Cotton",
      }));
    }
    if (featuredProjects && featuredProjects.length > 0) {
      displayProjects = featuredProjects.map((proj) => ({
        ...proj,
        specs: ["Custom Dyeing", "Precision Embellishment", "AQL 2.5 Inspection"],
      }));
    }
  } catch {
    // Graceful fallback to rich defaults
  }

  const heroTitle = content.hero_title || "Engineered Apparel Blanks & Contract Garment Manufacturing";
  const heroSubtitle =
    content.hero_subtitle ||
    "Lucky Fashion produces premium blank foundations, corporate staff uniforms, and custom bulk cut-and-sew apparel for growing brands, institutions, and enterprise fleets.";

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. Split Editorial Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-lucky-offwhite/50 to-white pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-lucky-borderLight">
        {/* Subtle Background Radial Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#8A2A78_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline, Trust Points, and Actions */}
            <div className="lg:col-span-7 space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lucky-cream text-lucky-dark text-xs font-bold border border-lucky-borderLight shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-lucky-magenta" />
                <span>B2B Contract Apparel Manufacturer • Direct Factory Floor</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-lucky-dark leading-[1.08]">
                  {heroTitle}
                </h1>
                <p className="text-base sm:text-lg text-lucky-mutedText leading-relaxed max-w-2xl">
                  {heroSubtitle}
                </p>
              </div>

              {/* Trust Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-lucky-borderLight shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-lucky-magenta shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-lucky-dark leading-tight">Physical Sign-Off</p>
                    <p className="text-[11px] text-lucky-mutedText mt-0.5">Pre-production sample</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-lucky-borderLight shadow-xs">
                  <Clock className="w-4 h-4 text-lucky-magenta shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-lucky-dark leading-tight">24–48h Turnaround</p>
                    <p className="text-[11px] text-lucky-mutedText mt-0.5">Formal quotation desk</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-lucky-borderLight shadow-xs">
                  <Factory className="w-4 h-4 text-lucky-magenta shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-lucky-dark leading-tight">Direct Mill Sourcing</p>
                    <p className="text-[11px] text-lucky-mutedText mt-0.5">Zero agent markups</p>
                  </div>
                </div>
              </div>

              {/* High-Contrast Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Button asChild size="lg" variant="default" className="shadow-md text-base px-8 h-12">
                  <Link href="/quote" className="inline-flex items-center justify-center gap-2">
                    <span>Request a Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="text-base px-8 h-12 border-lucky-borderLight hover:bg-lucky-lightNeutral">
                  <Link href="/products">
                    Explore Blank Silhouettes
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Layered Interactive Garment Presentation */}
            <div className="lg:col-span-5">
              <HeroGarmentShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Spec & Quick Quotation Configurator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuickQuoteCalculator />
      </section>

      {/* 3. Segmented Solutions: "Who We Fabricate For" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-lucky-magenta">
            Tailored Industry Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-lucky-dark mt-2">
            Who We Fabricate & Manufacture For
          </h2>
          <p className="text-sm text-lucky-mutedText mt-2 leading-relaxed">
            Every client vertical has distinct durability, fit, and packaging requirements. We engineer specifically for your operational model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Flame,
              badge: "Fashion & Retail",
              title: "Private Label Streetwear",
              description: "Boxy heavyweight blanks, loopback french terry hoodies, customized neck damask labels, and barcode-ready retail polybagging.",
              specs: ["240+ GSM Cotton", "Custom Woven Tags", "Pigment & Bio Washes"],
            },
            {
              icon: Building2,
              badge: "Enterprise",
              title: "Corporate Staff Uniforms",
              description: "Colorfast honeycomb pique polos, stain-resistant utility shirting, and embroidered company insignia designed for commercial wash cycles.",
              specs: ["Anti-Pilling Pique", "Reinforced Plackets", "Standardized Sizing"],
            },
            {
              icon: Trophy,
              badge: "Athletics",
              title: "Sports Clubs & Marathons",
              description: "Lightweight moisture-wicking interlock, ergonomic flatlock stitching, and reflective 3M transfers for running clubs and tournaments.",
              specs: ["150 GSM Dry-Fit", "Anti-Chafing Seams", "Sublimated Trims"],
            },
            {
              icon: Users,
              badge: "Entertainment",
              title: "Tour Merch & Event Bulk",
              description: "High-volume screen printed garments with soft-hand discharge inks and structured snapbacks, coordinated for strict festival deadlines.",
              specs: ["Water-Based Discharge", "High-Volume Capacity", "Expedited Freight"],
            },
          ].map((sector, idx) => {
            const Icon = sector.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm hover:shadow-md hover:border-lucky-magenta/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-lucky-cream flex items-center justify-center text-lucky-magenta font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-lucky-mutedText bg-lucky-lightNeutral px-2 py-0.5 rounded">
                      {sector.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-lucky-dark group-hover:text-lucky-magenta transition-colors">
                    {sector.title}
                  </h3>
                  <p className="text-xs text-lucky-mutedText mt-2 leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-lucky-borderLight/80">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sector.specs.map((spec) => (
                      <span key={spec} className="text-[10px] font-semibold text-lucky-dark bg-lucky-cream/50 px-2 py-0.5 rounded border border-lucky-borderLight">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/quote?vertical=${encodeURIComponent(sector.title)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-lucky-magenta group-hover:underline"
                  >
                    <span>Request a Quote for this Sector</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Core Apparel Blank Profiles Showcase with Interactive Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-lucky-magenta" />
              <span className="text-xs uppercase font-bold tracking-wider text-lucky-magenta">
                Catalog & Blank Profiles
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-lucky-dark">
              Field-Tested Apparel Foundations
            </h2>
            <p className="text-sm text-lucky-mutedText mt-1.5 max-w-xl">
              Select proven silhouettes ready for custom dyeing, silk-screen printing, 3D embroidery, and private labeling.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="border-lucky-borderLight hover:bg-lucky-lightNeutral">
            <Link href="/products" className="inline-flex items-center gap-1.5 font-bold">
              <span>View Full Blank Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Tab-Filterable Garment Grid */}
        <BlankCatalogFilter products={displayProducts} />
      </section>

      {/* 5. Production Journey: How We Work (4-Step B2B Process) */}
      <section className="bg-lucky-dark text-white py-20 sm:py-24 border-y border-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-lucky-cream">
              Precision Contract Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-2">
              From Tech Pack to Container Dispatch
            </h2>
            <p className="text-sm text-purple-200 mt-2 leading-relaxed">
              We eliminate guesswork with structured pre-production checkpoints, physical sample sign-offs, and automated quality audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: FileCheck,
                title: "Silhouette & Spec Alignment",
                description: "Select from our field-tested blank patterns or submit your custom tech pack. We verify fabric GSM, ribbing density, and seam specs.",
              },
              {
                step: "02",
                icon: Palette,
                title: "Lab Dip & Artwork Digitizing",
                description: "We prepare Pantone-matched fabric dye recipes and convert your artwork into high-definition vector screens and Tajima stitch files.",
              },
              {
                step: "03",
                icon: PackageCheck,
                title: "Pre-Production Sample Sign-Off",
                description: "A complete physical sample is stitched and dispatched for your tactile touch, dimensional sizing check, and print approval.",
              },
              {
                step: "04",
                icon: Scissors,
                title: "Bulk Cut, Sew & AQL 2.5 Audit",
                description: "Automated precision fabric spreading, seam joining, multi-point quality inspection, custom labeling, and scheduled shipping.",
              },
            ].map((phase) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.step}
                  className="rounded-2xl bg-lucky-darkCard/80 border border-purple-900/60 p-6 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 text-4xl font-black font-heading text-purple-900/40 select-none">
                    {phase.step}
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-lucky-magenta/30 border border-lucky-magenta/50 flex items-center justify-center text-lucky-cream mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-purple-200 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-purple-900/40 flex items-center gap-2 text-[11px] text-lucky-cream font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lucky-cream" />
                    <span>Verified Milestone</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="secondary" className="shadow-md">
              <Link href="/quote" className="inline-flex items-center gap-2 font-bold text-lucky-dark">
                <span>Start Your Production Spec</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Interactive Fabric & Textile Lab Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FabricLabExplorer />
      </section>

      {/* 7. Manufacturing & Embellishment Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-lucky-magenta">
            In-House Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-lucky-dark mt-2">
            Embellishment & Finishing Studio
          </h2>
          <p className="text-sm text-lucky-mutedText mt-2">
            Every embellishment is calibrated for longevity, soft-hand texture, and washing endurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Printer,
              title: "Screen Printing Studio",
              points: ["Soft-hand water-based discharge", "High-solid stretch plastisol", "Up to 10 spot colors per print", "Zero ink cracking on stretch"],
            },
            {
              icon: Sparkles,
              title: "3D & Flat Tajima Embroidery",
              points: ["Up to 15,000 stitches per design", "High-density 3D foam puff", "Metallic & colorfast poly threads", "Appliqué & felt patch joining"],
            },
            {
              icon: Layers,
              title: "Heat Transfers & Silicone",
              points: ["Ultra-sharp Direct-to-Film (DTF)", "Raised matte silicone emblems", "3M Scotchlite reflective graphics", "Ideal for technical activewear"],
            },
            {
              icon: Factory,
              title: "Branding, Trims & Packaging",
              points: ["Damask high-density woven neck labels", "Tagless heat-transfer care labels", "Custom cardstock hangtags with cords", "Individual barcode retail polybags"],
            },
          ].map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-lucky-cream flex items-center justify-center text-lucky-magenta font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-lucky-dark">
                  {cap.title}
                </h3>
                <ul className="space-y-2 text-xs text-lucky-mutedText">
                  {cap.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-lucky-magenta shrink-0 mt-1.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Recent Completed Orders / Client Lookbook */}
      <section className="bg-lucky-dark text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-lucky-cream">
                Verified Deliveries
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-1">
                Completed Production Orders
              </h2>
              <p className="text-sm text-purple-200 mt-1 max-w-xl">
                Demonstrated excellence across corporate rollouts, sports tournaments, and private label apparel collections.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="border-purple-800 text-lucky-cream hover:bg-lucky-darkCard">
              <Link href="/our-work" className="inline-flex items-center gap-1.5">
                <span>View Full Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProjects.map((proj) => (
              <div
                key={proj.id}
                className="group rounded-2xl bg-lucky-darkCard border border-purple-900/60 overflow-hidden flex flex-col justify-between hover:border-lucky-magenta/50 transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <OptimizedImage
                      src={proj.cover_image_url || ""}
                      alt={proj.title}
                      width={500}
                      height={320}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lucky-dark/90 text-lucky-cream border border-purple-800">
                        {proj.client_type || "Client Order"}
                      </span>
                    </div>
                    {proj.is_demo && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="sample" className="bg-lucky-dark/90 border-lucky-magenta text-lucky-cream">
                          Sample
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-lucky-cream transition-colors">
                      <Link href={`/our-work/${proj.slug}`}>{proj.title}</Link>
                    </h3>
                    <p className="text-xs text-purple-200 mt-2 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-purple-900/50 flex flex-wrap gap-1.5">
                      {proj.specs?.map((s: string) => (
                        <span key={s} className="text-[10px] font-semibold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-900">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button asChild size="sm" variant="outline" className="w-full border-purple-800 text-lucky-cream hover:bg-purple-900/40">
                    <Link href={`/our-work/${proj.slug}`}>
                      Inspect Project Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Procurement & Manufacturing FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-lucky-magenta">
            Buyer Reassurance
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-lucky-dark mt-2">
            Frequently Asked Manufacturing Questions
          </h2>
          <p className="text-sm text-lucky-mutedText mt-2">
            Clear, transparent answers for brand founders and corporate procurement teams.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-white border border-lucky-borderLight rounded-2xl px-6 py-2 shadow-xs">
            <AccordionTrigger className="text-base font-bold text-lucky-dark hover:no-underline">
              Do you provide a physical pre-production sample before bulk production?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-lucky-mutedText leading-relaxed">
              Yes, absolutely. For confirmed production batches, our standard operating procedure is to fabricate a complete physical pre-production prototype (complete with your fabric, dye color, and embellishments) for your hands-on touch, fit, and measurement sign-off before we proceed with bulk cutting and assembly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white border border-lucky-borderLight rounded-2xl px-6 py-2 shadow-xs">
            <AccordionTrigger className="text-base font-bold text-lucky-dark hover:no-underline">
              How do I get a custom quotation for my apparel order?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-lucky-mutedText leading-relaxed">
              Simply click the &quot;Request a Quote&quot; button to launch our 6-step quotation portal. You can select your garment silhouettes, input quantity breakdowns by size, attach your artwork or tech packs, and submit. Our technical desk reviews the submission and returns a comprehensive specification proposal within 24 to 48 hours.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white border border-lucky-borderLight rounded-2xl px-6 py-2 shadow-xs">
            <AccordionTrigger className="text-base font-bold text-lucky-dark hover:no-underline">
              What artwork formats do you accept for embroidery and printing?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-lucky-mutedText leading-relaxed">
              We recommend vector formats (Adobe Illustrator .AI, EPS, SVG, or vector PDF) with fonts converted to outlines. For photo-realistic screen prints or DTF transfers, high-resolution raster files (300 DPI PNG with transparent background) are fully supported.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-white border border-lucky-borderLight rounded-2xl px-6 py-2 shadow-xs">
            <AccordionTrigger className="text-base font-bold text-lucky-dark hover:no-underline">
              Can you dye fabrics to exact custom Pantone (PMS) colors?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-lucky-mutedText leading-relaxed">
              Yes. We provide precision Pantone Matching System (PMS) color dyeing using reactive dyes that ensure high washfastness and zero crocking. We prepare physical lab-dip swatches for your color sign-off under D65 daylight matching standards.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-white border border-lucky-borderLight rounded-2xl px-6 py-2 shadow-xs">
            <AccordionTrigger className="text-base font-bold text-lucky-dark hover:no-underline">
              Do you handle custom relabeling, woven neck tags, and packaging?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-lucky-mutedText leading-relaxed">
              Yes. We offer complete private label finishing packages: high-density damask woven neck tags, tagless heat-transfer care labels, customized cardstock hangtags with safety pins or cotton strings, and individually folded barcoded retail polybagging.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 10. High-Converting Closing Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-lucky-dark via-lucky-darkCard to-lucky-dark p-8 sm:p-14 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-2xl border border-purple-900/60 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-lucky-magenta/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lucky-cream/20 text-lucky-cream text-xs font-bold mb-3 border border-lucky-cream/30">
              <Sparkles className="w-3.5 h-3.5 text-lucky-cream" />
              <span>Direct Mill Partnership</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-lucky-cream mb-3">
              Ready to Fabricate Your Custom Apparel Batch?
            </h2>
            <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
              Submit your desired quantities, garment silhouettes, and branding files. Our engineering desk formulates a verified production quotation within 24 to 48 hours.
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" variant="secondary" className="font-bold text-lucky-dark shadow-lg px-8 h-12">
              <Link href="/quote" className="flex items-center justify-center gap-2">
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-purple-800 text-lucky-cream hover:bg-lucky-darkCard px-6 h-12">
              <Link href="/contact">
                Contact Factory Desk
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
