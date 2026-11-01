"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2, ShieldCheck, Layers, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HERO_GARMENTS = [
  {
    id: "tee",
    name: "Heavyweight Boxy Crewneck",
    category: "T-Shirts",
    gsm: "240 GSM",
    composition: "100% Combed Ring-Spun Cotton",
    stitching: "Twin-needle coverstitch hems, 1x1 rib collar",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
    color: "Jet Black / Custom Dyed",
  },
  {
    id: "polo",
    name: "Classic Pique Corporate Polo",
    category: "Polo Shirts",
    gsm: "220 GSM",
    composition: "65% Combed Cotton / 35% Poly Blend",
    stitching: "Reinforced placket, horn buttons, ribbed cuffs",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=85",
    color: "Midnight Navy / Custom Dyed",
  },
  {
    id: "hoodie",
    name: "Heavyweight Brushed Fleece Pullover",
    category: "Hoodies & Fleece",
    gsm: "360 GSM",
    composition: "80% Cotton / 20% Polyester Fleece",
    stitching: "Double-lined 3-piece hood, concealed kangaroo pouch",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85",
    color: "Heather Oatmeal / Custom Dyed",
  },
];

export function HeroGarmentShowcase() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const garment = HERO_GARMENTS[selectedIdx];

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Background Decorative Accent Ring (#EEE3B0 and #500071 subtle glow) */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-lucky-cream/40 via-lucky-magenta/10 to-lucky-violet/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main Garment Presentation Card */}
      <div className="rounded-3xl bg-white border border-lucky-borderLight shadow-xl overflow-hidden">
        {/* Top Garment Selector Tabs */}
        <div className="p-3 bg-lucky-offwhite/90 border-b border-lucky-borderLight flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {HERO_GARMENTS.map((g, idx) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedIdx === idx
                    ? "bg-lucky-dark text-lucky-cream shadow-xs"
                    : "text-lucky-mutedText hover:text-lucky-dark hover:bg-white"
                }`}
              >
                {g.category}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-lucky-magenta bg-lucky-cream/50 px-2.5 py-1 rounded-md border border-lucky-borderLight">
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Blank</span>
          </div>
        </div>

        {/* Visual Showcase with Tactile Callout Pins */}
        <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-lucky-lightNeutral/40">
          <Image
            src={garment.image}
            alt={garment.name}
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />

          {/* Floating Spec Tag 1: GSM & Yarn */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-lucky-borderLight shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lucky-magenta animate-pulse" />
            <div>
              <p className="text-[10px] uppercase font-bold text-lucky-mutedText tracking-wider leading-none">
                Fabric Weight
              </p>
              <p className="text-xs font-black font-heading text-lucky-dark leading-tight">
                {garment.gsm}
              </p>
            </div>
          </div>

          {/* Floating Spec Tag 2: Composition */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-lucky-dark/95 backdrop-blur-md px-4 py-2 rounded-xl border border-lucky-violet shadow-lg text-white">
            <div className="flex items-center gap-2 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lucky-cream" />
              <span className="text-xs font-bold text-lucky-cream">{garment.name}</span>
            </div>
            <p className="text-[11px] text-purple-200">
              {garment.composition} • {garment.stitching}
            </p>
          </div>

          {/* Sample Badge (Rule: Demo/Sample Transparency) */}
          <div className="absolute top-4 right-4">
            <Badge variant="sample" className="shadow-xs bg-white/90">
              Sample Blank
            </Badge>
          </div>
        </div>

        {/* Factory Guarantee Sub-Bar */}
        <div className="p-4 bg-white border-t border-lucky-borderLight grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-lucky-dark font-medium">
            <ShieldCheck className="w-4 h-4 text-lucky-magenta shrink-0" />
            <span>Pre-production sample physical sign-off</span>
          </div>
          <div className="flex items-center gap-2 text-lucky-dark font-medium">
            <Layers className="w-4 h-4 text-lucky-magenta shrink-0" />
            <span>Pantone PMS color lab dip matching</span>
          </div>
        </div>
      </div>
    </div>
  );
}

