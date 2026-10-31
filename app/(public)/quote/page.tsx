import React from "react";
import { createClient } from "@/lib/supabase/server";
import { QuotationWizard } from "@/components/forms/quotation-wizard";

interface QuotePageProps {
  searchParams: {
    product?: string;
    project?: string;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-lucky-blue">
          Custom Production Portal
        </span>
        <h1 className="text-4xl font-bold font-heading text-lucky-dark mt-1">
          Request a Manufacturing Quotation
        </h1>
        <p className="text-sm text-lucky-mutedText mt-2 max-w-2xl">
          Complete the guided specification steps below. Our factory estimators review fabric composition, volume tiers, and embellishment complexity to return a detailed proposal within 24 to 48 hours.
        </p>
      </div>

      <QuotationWizard
        availableMaterials={materials}
        prefilledProduct={prefilledProduct}
        prefilledProject={prefilledProject}
      />
    </div>
  );
}

