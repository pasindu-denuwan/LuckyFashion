"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const SWATCHES = [
  {
    id: "combed-cotton",
    name: "Heavyweight Combed Ring-Spun Cotton",
    gsm: "240 GSM",
    composition: "100% Long-Staple Combed Cotton",
    finish: "Bio-Polished Enzyme Wash & Pre-Shrunk",
    applications: "Luxury streetwear t-shirts, oversized heavy blanks, tour merch",
    printMethods: ["Discharge Screen Print", "Water-based Ink", "Direct-to-Film (DTF)", "High-Density Embroidery"],
    touchFeel: "Silky-soft hand feel, dense tight knit, zero transparency, zero side-seam torquing",
    colorHex: "#222222",
  },
  {
    id: "pique-knit",
    name: "Classic Honeycomb Pique Knit",
    gsm: "220 GSM",
    composition: "65% Ring-Spun Cotton / 35% Poly Blend",
    finish: "Colorfast Reactive Dye, Mercerized Flat Collar",
    applications: "Corporate enterprise polo shirts, hospitality staff uniforms, golf collections",
    printMethods: ["Direct Embroidery (up to 15,000 stitches)", "Sublimated Rib Tipping", "Laser Engraved Buttons"],
    touchFeel: "Textured honeycomb weave, breathable structure, wrinkle-resistant wash recovery",
    colorHex: "#1c2e4a",
  },
  {
    id: "brushed-fleece",
    name: "Ultra-Heavy Brushed Terry Fleece",
    gsm: "360 GSM",
    composition: "80% Combed Cotton / 20% Poly Core",
    finish: "Brushed Interior, Double-Dye Heather Finish",
    applications: "Luxury heavyweight hoodies, quarter-zips, heavyweight crewnecks, sweatpants",
    printMethods: ["Puff Print", "Appliqué Embroidery", "Silicone Heat Transfer", "Custom Woven Neck Labels"],
    touchFeel: "Plush, cloud-soft interior fleece, robust heavyweight drape, thermal insulation",
    colorHex: "#4a3c31",
  },
  {
    id: "dry-fit-interlock",
    name: "Dry-Fit Micro-Interlock Performance Mesh",
    gsm: "150 GSM",
    composition: "100% Moisture-Wicking Poly Interlock",
    finish: "Anti-Bacterial Silver Finish, UPF 30+ Sun Protection",
    applications: "Marathon finisher tees, athletic training shirts, gym singlets, soccer kits",
    printMethods: ["All-Over Dye Sublimation", "Reflective Safety Heat Transfers", "Silicone Badges"],
    touchFeel: "Ultra-lightweight, rapid evaporative drying, high mechanical 4-way stretch",
    colorHex: "#500071",
  },
];

export function FabricLabExplorer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSwatch = SWATCHES[activeIdx];

  return (
    <div className="rounded-3xl bg-white border border-lucky-borderLight shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Swatch Selector Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-lucky-offwhite/80 border-b lg:border-b-0 lg:border-r border-lucky-borderLight flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-lucky-magenta" />
              <span className="text-xs uppercase font-bold text-lucky-mutedText tracking-wider">
                Textile & Fabric Engineering
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-lucky-dark">
              Mill-Direct Fabric Substrates
            </h3>
            <p className="text-xs text-lucky-mutedText mt-1.5 leading-relaxed">
              Explore our core field-tested fabrics engineered for colorfastness, durability, and superior print adhesion.
            </p>

            <div className="mt-6 space-y-2.5">
              {SWATCHES.map((swatch, idx) => {
                const isSelected = activeIdx === idx;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-lucky-dark text-lucky-cream border-lucky-dark shadow-sm"
                        : "bg-white text-lucky-dark border-lucky-borderLight hover:border-lucky-mutedText"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: swatch.colorHex }}
                      />
                      <div>
                        <p className={`text-xs font-bold leading-tight ${isSelected ? "text-lucky-cream" : "text-lucky-dark"}`}>
                          {swatch.name}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? "text-purple-200" : "text-lucky-mutedText"}`}>
                          {swatch.gsm} • {swatch.composition}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lucky-magenta text-white shrink-0">
                        Inspecting
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-lucky-borderLight/80 flex items-center gap-2 text-xs text-lucky-mutedText">
            <ShieldCheck className="w-4 h-4 text-lucky-magenta shrink-0" />
            <span>Custom Pantone yarn dyeing available for orders over 300 pcs.</span>
          </div>
        </div>

        {/* Right Swatch Detail Inspection Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-lucky-borderLight">
              <div>
                <span className="text-xs font-mono font-bold text-lucky-magenta">
                  SPEC PROFILE {activeIdx + 1} OF {SWATCHES.length}
                </span>
                <h4 className="text-2xl font-bold font-heading text-lucky-dark mt-0.5">
                  {activeSwatch.name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-bold tracking-wider text-lucky-mutedText">
                  Weight Grade
                </span>
                <p className="text-xl font-black font-heading text-lucky-magenta">
                  {activeSwatch.gsm}
                </p>
              </div>
            </div>

            {/* Spec Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-lucky-lightNeutral/50 border border-lucky-borderLight">
                <p className="font-bold text-lucky-mutedText uppercase tracking-wider text-[10px]">
                  Fibre Composition
                </p>
                <p className="font-semibold text-lucky-dark mt-1">
                  {activeSwatch.composition}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-lucky-lightNeutral/50 border border-lucky-borderLight">
                <p className="font-bold text-lucky-mutedText uppercase tracking-wider text-[10px]">
                  Technical Finishing
                </p>
                <p className="font-semibold text-lucky-dark mt-1">
                  {activeSwatch.finish}
                </p>
              </div>
            </div>

            {/* Hand-feel / Texture */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-lucky-mutedText mb-1.5">
                Hand-Feel & Textile Character
              </p>
              <p className="text-xs text-lucky-dark leading-relaxed bg-lucky-cream/40 p-3.5 rounded-xl border border-lucky-borderLight">
                {activeSwatch.touchFeel}
              </p>
            </div>

            {/* Embellishment Compatibility */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-lucky-mutedText mb-2">
                Certified Embellishment Techniques
              </p>
              <div className="flex flex-wrap gap-2">
                {activeSwatch.printMethods.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-lucky-borderLight text-lucky-dark shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-lucky-magenta" />
                    <span>{m}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-lucky-borderLight flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-lucky-mutedText">
              Want physical fabric swatches included in your sample kit?
            </p>
            <Button asChild size="default" variant="default" className="w-full sm:w-auto">
              <Link href={`/quote?fabric=${encodeURIComponent(activeSwatch.id)}`}>
                Request a Quote with this Fabric <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
