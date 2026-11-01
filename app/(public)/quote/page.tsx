import React from "react";
import { createClient } from "@/lib/supabase/server";
import { QuotationWizard } from "@/components/forms/quotation-wizard";
import { Sparkles, ShieldCheck, Clock } from "lucide-react";

interface QuotePageProps {
  searchParams: {
    product?: string;
    project?: string;
    category?: string;
    volume?: string;
    technique?: string;
    fabric?: string;
    vertical?: string;
  };
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const supabase = createClient();

  const [
    { data: settings },
    { data: prefilledProduct },
    { data: prefilledProject },
  ] = await Promise.all([
    supabase.from("business_settings").select("available_materials").eq("id", "default").single(),
    searchParams.product
      ? supabase.from("products").select("name, slug").eq("slug", searchParams.product).single()
      : Promise.resolve({ data: null }),
    searchParams.project
      ? supabase.from("completed_orders").select("title, slug").eq("slug", searchParams.project).single()
      : Promise.resolve({ data: null }),
  ]);

  const materials = settings?.available_materials || [
    "100% Combed Cotton",
    "Cotton-Polyester Blend",
    "Dry-Fit Polyester",
    "Single Jersey",
    "Pique Cotton",
    "Heavyweight Fleece",
  ];

  const initialConfig = {
    category: searchParams.category,
    volume: searchParams.volume,
    technique: searchParams.technique,
    fabric: searchParams.fabric,
    vertical: searchParams.vertical,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-lucky-dark to-lucky-darkCard p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border border-purple-900/60">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lucky-cream/20 text-lucky-cream text-xs font-bold border border-lucky-cream/30">
            <Sparkles className="w-3.5 h-3.5 text-lucky-cream" />
            <span>Custom Production Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            Request a Manufacturing Quotation
          </h1>
          <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
            Configure your apparel line, target batch quantities, and customization requirements. Our engineering desk verifies fabric availability, machine scheduling, and prepares formal terms within 24 to 48 hours.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-purple-300">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lucky-cream" />
              Physical prototype sign-off included
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-lucky-cream" />
              24–48h proposal turnaround
            </span>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-lucky-magenta/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      <QuotationWizard
        availableMaterials={materials}
        prefilledProduct={prefilledProduct}
        prefilledProject={prefilledProject}
        initialConfig={initialConfig}
      />
    </div>
  );
}
