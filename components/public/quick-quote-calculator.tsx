"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, SlidersHorizontal, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { id: "t-shirts", label: "T-Shirts", defaultGsm: "180 - 240 GSM" },
  { id: "polo-shirts", label: "Polo Shirts", defaultGsm: "220 GSM Pique" },
  { id: "hoodies-sweatshirts", label: "Hoodies & Fleece", defaultGsm: "340 - 400 GSM" },
  { id: "corporate-uniforms", label: "Corporate Uniforms", defaultGsm: "Twill / Poplin" },
  { id: "sportswear-activewear", label: "Sportswear", defaultGsm: "150 GSM Interlock" },
  { id: "caps-headwear", label: "Caps & Headwear", defaultGsm: "Cotton Twill" },
];

const VOLUMES = [
  { id: "50-150", label: "50 – 150 pcs", desc: "Sample / Pilot Run" },
  { id: "151-500", label: "151 – 500 pcs", desc: "Standard Brand Drop" },
  { id: "501-1500", label: "501 – 1,500 pcs", desc: "Enterprise Order" },
  { id: "1500+", label: "1,500+ pcs", desc: "High-Volume Production" },
];

const TECHNIQUES = [
  { id: "embroidery", label: "3D & Flat Embroidery", desc: "Up to 15,000 stitches" },
  { id: "screen-print", label: "Discharge / Plastisol Print", desc: "Soft-hand water-based" },
  { id: "dtf-silicone", label: "Silicone & DTF Transfers", desc: "High-stretch details" },
  { id: "cut-sew-plain", label: "Custom Cut & Sew Blank", desc: "Woven tags & relabeling" },
];

export function QuickQuoteCalculator() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedVolume, setSelectedVolume] = useState(VOLUMES[1].id);
  const [selectedTechnique, setSelectedTechnique] = useState(TECHNIQUES[0].id);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const activeVolumeObj = VOLUMES.find((v) => v.id === selectedVolume);
  const activeTechniqueObj = TECHNIQUES.find((t) => t.id === selectedTechnique);

  const quoteUrl = `/quote?category=${encodeURIComponent(selectedCategory)}&volume=${encodeURIComponent(
    selectedVolume
  )}&technique=${encodeURIComponent(selectedTechnique)}`;

  return (
    <div className="rounded-3xl bg-white border border-lucky-borderLight shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-lucky-dark to-lucky-darkCard p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lucky-cream/20 text-lucky-cream text-xs font-bold mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Interactive Spec Builder</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Configure Your Custom Production Spec
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl leading-relaxed">
              Select your silhouette, volume tier, and embellishment. Our technical team prepares a verified factory quotation within 24–48 hours.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-xs uppercase font-bold tracking-wider text-lucky-cream">
              Turnaround Time
            </span>
            <span className="text-lg font-bold font-heading text-white">
              14–21 Days Standard
            </span>
            <span className="text-[11px] text-purple-300">
              Rush 7–10 days available
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Step 1: Garment Silhouette */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-lucky-mutedText mb-3">
            Step 1: Choose Garment Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-lucky-magenta bg-lucky-magenta/5 shadow-xs ring-2 ring-lucky-magenta/20"
                      : "border-lucky-borderLight hover:border-lucky-mutedText bg-white"
                  }`}
                >
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? "text-lucky-magenta" : "text-lucky-dark"
                    }`}
                  >
                    {cat.label}
                  </p>
                  <p className="text-[10px] text-lucky-mutedText mt-1 font-mono">
                    {cat.defaultGsm}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Batch Volume Tier */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-lucky-mutedText mb-3">
            Step 2: Estimated Production Quantity
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {VOLUMES.map((vol) => {
              const isSelected = selectedVolume === vol.id;
              return (
                <button
                  key={vol.id}
                  type="button"
                  onClick={() => setSelectedVolume(vol.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-lucky-magenta bg-lucky-magenta/5 shadow-xs ring-2 ring-lucky-magenta/20"
                      : "border-lucky-borderLight hover:border-lucky-mutedText bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className={`text-sm font-bold ${
                        isSelected ? "text-lucky-magenta" : "text-lucky-dark"
                      }`}
                    >
                      {vol.label}
                    </p>
                    {isSelected && (
                      <Check className="w-4 h-4 text-lucky-magenta" />
                    )}
                  </div>
                  <p className="text-[11px] text-lucky-mutedText">
                    {vol.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Embellishment Technique */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-lucky-mutedText mb-3">
            Step 3: Primary Embellishment or Technique
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TECHNIQUES.map((tech) => {
              const isSelected = selectedTechnique === tech.id;
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setSelectedTechnique(tech.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-lucky-magenta bg-lucky-magenta/5 shadow-xs ring-2 ring-lucky-magenta/20"
                      : "border-lucky-borderLight hover:border-lucky-mutedText bg-white"
                  }`}
                >
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? "text-lucky-magenta" : "text-lucky-dark"
                    }`}
                  >
                    {tech.label}
                  </p>
                  <p className="text-[11px] text-lucky-mutedText mt-1">
                    {tech.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Config Summary & Direct "Request a Quote" CTA */}
        <div className="pt-6 border-t border-lucky-borderLight flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-lucky-offwhite/60 p-5 rounded-2xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lucky-magenta" />
              <span className="text-xs font-bold text-lucky-dark uppercase tracking-wider">
                Configured Production Specification:
              </span>
            </div>
            <p className="text-sm font-bold text-lucky-dark">
              {activeVolumeObj?.label} of {activeCategoryObj?.label} with {activeTechniqueObj?.label}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-lucky-mutedText">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-lucky-magenta" />
                Physical sample sign-off included
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-lucky-magenta" />
                Quote turnaround: 24–48 hours
              </span>
            </div>
          </div>

          <Button asChild size="lg" variant="default" className="w-full lg:w-auto shrink-0 shadow-md">
            <Link href={quoteUrl} className="flex items-center justify-center gap-2">
              <span>Request a Quote for this Spec</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

