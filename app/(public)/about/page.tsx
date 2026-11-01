import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Sparkles, Factory, CheckCircle2, ArrowRight, Layers, Award } from "lucide-react";

export default async function AboutPage() {
  const supabase = createClient();

  const { data: contentRecord } = await supabase
    .from("website_content")
    .select("content")
    .eq("page_key", "about")
    .single();

  const content = contentRecord?.content || {};
  const title = content.title || "Craftsmanship, Ethical Manufacturing & Technical Precision";
  const subtitle =
    content.subtitle ||
    "Lucky Fashion partners directly with growing apparel brands, corporate enterprises, and institutions to fabricate dependable custom garments without broker markups.";
  const mission =
    content.mission ||
    "To provide brands and institutions with reliable, high-specification garment manufacturing, transparent communication, and timely deliveries.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="rounded-3xl bg-gradient-to-r from-lucky-dark to-lucky-darkCard p-8 sm:p-14 text-white relative overflow-hidden shadow-lg border border-purple-900/60">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lucky-cream/20 text-lucky-cream text-xs font-bold border border-lucky-cream/30">
            <Sparkles className="w-3.5 h-3.5 text-lucky-cream" />
            <span>Factory Heritage & Principles</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-lucky-magenta/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Operational Mission Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-lucky-borderLight shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-lucky-magenta" />
          <h2 className="text-2xl font-bold font-heading text-lucky-dark">
            Our Operational Mission
          </h2>
        </div>
        <p className="text-sm sm:text-base text-lucky-dark leading-relaxed max-w-4xl">
          {mission}
        </p>
      </div>

      {/* Four Quality Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-lucky-magenta">
            How We Manufacture
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-lucky-dark mt-1">
            Built for Reliable, Repeatable Garment Production
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lucky-cream flex items-center justify-center text-lucky-magenta font-bold">
              <Factory className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold font-heading text-lucky-dark">
              Direct Factory Floor
            </h4>
            <p className="text-xs text-lucky-mutedText leading-relaxed">
              Eliminating broker markups and third-party communication layers. Work directly with garment engineers, pattern plotters, and production supervisors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lucky-cream flex items-center justify-center text-lucky-magenta font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold font-heading text-lucky-dark">
              AQL 2.5 Inspection Gates
            </h4>
            <p className="text-xs text-lucky-mutedText leading-relaxed">
              Every garment batch passes four strict checkpoints: raw fabric shrinkage control, pre-sew laser cutting accuracy, seam tensile strength, and finished carton inspection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lucky-cream flex items-center justify-center text-lucky-magenta font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold font-heading text-lucky-dark">
              Technical Embellishment
            </h4>
            <p className="text-xs text-lucky-mutedText leading-relaxed">
              In-house Tajima 3D embroidery machines, water-based soft-hand silkscreens, Direct-to-Film (DTF), and silicone transfer applications engineered for longevity.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Call to Action */}
      <div className="rounded-3xl bg-lucky-dark text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-900/60 shadow-xl">
        <div className="max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-lucky-cream">
            Partner with Lucky Fashion
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 mt-2 leading-relaxed">
            Inquire about our fabric certifications, factory compliance standards, or request a verified production quotation.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary" className="font-bold text-lucky-dark shadow-md shrink-0">
          <Link href="/quote" className="flex items-center gap-2">
            <span>Request a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
