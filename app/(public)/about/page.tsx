import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Sparkles, Factory, Users } from "lucide-react";

export default async function AboutPage() {
  const supabase = createClient();

  const { data: contentRecord } = await supabase
    .from("website_content")
    .select("content")
    .eq("page_key", "about")
    .single();

  const content = contentRecord?.content || {};
  const title = content.title || "About Lucky Fashion";
  const subtitle =
    content.subtitle ||
    "Dedicated to Craftsmanship, Ethical Manufacturing, and Scalable Delivery";
  const mission =
    content.mission ||
    "To provide brands and institutions with reliable, high-specification garment manufacturing, transparent communication, and timely deliveries.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-lucky-blue">
          Textile Heritage & Principles
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-lucky-dark mt-2 mb-4">
          {title}
        </h1>
        <p className="text-lg text-lucky-mutedText leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-lucky-borderLight shadow-sm">
        <h2 className="text-2xl font-bold font-heading text-lucky-dark mb-4">
          Our Operational Mission
        </h2>
        <p className="text-sm sm:text-base text-lucky-dark leading-relaxed max-w-4xl">
          {mission}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 space-y-3">
          <Factory className="w-8 h-8 text-lucky-blue" />
          <h3 className="text-lg font-bold font-heading text-lucky-dark">Direct Factory Direct</h3>
          <p className="text-xs text-lucky-mutedText leading-relaxed">
            Eliminating broker markups and communication layers. Work directly with garment engineers and production coordinators.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <ShieldCheck className="w-8 h-8 text-lucky-blue" />
          <h3 className="text-lg font-bold font-heading text-lucky-dark">Strict Quality Standards</h3>
          <p className="text-xs text-lucky-mutedText leading-relaxed">
            Every garment batch undergoes four inspection gates: fabric shrinkage control, pre-sew cutting, stitching tension, and packaging inspection.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <Sparkles className="w-8 h-8 text-lucky-blue" />
          <h3 className="text-lg font-bold font-heading text-lucky-dark">Custom Embellishment</h3>
          <p className="text-xs text-lucky-mutedText leading-relaxed">
            Specialized in complex multi-technique embellishments, from water-base silkscreens to direct embroidery and heat-welded silicone logos.
          </p>
        </Card>
      </div>

      <div className="rounded-3xl bg-lucky-dark text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold font-heading">Partner with Lucky Fashion</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Inquire about our fabric certifications, factory compliance reports, or request customized samples.
          </p>
        </div>
        <Button asChild size="lg" variant="default" className="shrink-0">
          <Link href="/quote">Request a Quote</Link>
        </Button>
      </div>
    </div>
  );
}

