"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";

export interface BlankProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_name: string;
  category_slug?: string;
  available_sizes: string[];
  cover_image_url: string;
  is_demo: boolean;
  gsm?: string;
  fabric_blend?: string;
}

interface BlankCatalogFilterProps {
  products: BlankProductItem[];
}

export function BlankCatalogFilter({ products }: BlankCatalogFilterProps) {
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", label: "All Blanks" },
    { id: "t-shirts", label: "T-Shirts" },
    { id: "polo-shirts", label: "Polo Shirts" },
    { id: "hoodies-sweatshirts", label: "Hoodies & Fleece" },
    { id: "sportswear-activewear", label: "Sportswear" },
    { id: "corporate-uniforms", label: "Corporate Wear" },
  ];

  const filtered = products.filter((p) => {
    if (activeTab === "all") return true;
    const catSlug = p.category_slug || p.category_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return catSlug.includes(activeTab) || activeTab.includes(catSlug);
  });

  return (
    <div className="space-y-8">
      {/* Tab Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-lucky-dark text-lucky-cream shadow-sm"
                  : "bg-white text-lucky-mutedText hover:text-lucky-dark border border-lucky-borderLight hover:bg-lucky-lightNeutral/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Garments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="group rounded-2xl bg-white border border-lucky-borderLight shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-lucky-lightNeutral/40">
                <OptimizedImage
                  src={p.cover_image_url}
                  alt={p.name}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-lucky-magenta border border-lucky-borderLight shadow-xs">
                    {p.category_name}
                  </span>
                </div>
                {p.is_demo && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="sample" className="bg-white/95">
                      Sample
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-5 pb-2">
                <h3 className="font-heading font-bold text-base text-lucky-dark group-hover:text-lucky-magenta transition-colors line-clamp-1">
                  <Link href={`/products/${p.slug}`}>{p.name}</Link>
                </h3>
                <p className="text-xs text-lucky-mutedText mt-1.5 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* Garment Spec Tags */}
                <div className="mt-4 pt-3 border-t border-lucky-borderLight/80 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold text-lucky-dark bg-lucky-cream/60 px-2 py-0.5 rounded-md border border-lucky-borderLight">
                    {p.gsm || "Custom Weight"}
                  </span>
                  <span className="text-[10px] font-semibold text-lucky-mutedText bg-lucky-lightNeutral px-2 py-0.5 rounded-md">
                    Sizes: {p.available_sizes?.slice(0, 3).join(", ")}...
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer: Strictly "Request a Quote" CTA and Specs link */}
            <div className="p-5 pt-3 border-t border-lucky-borderLight flex items-center justify-between gap-2">
              <Link
                href={`/products/${p.slug}`}
                className="text-xs font-semibold text-lucky-mutedText hover:text-lucky-magenta transition flex items-center gap-0.5"
              >
                <span>Specs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <Button asChild size="sm" variant="default" className="shadow-xs">
                <Link href={`/quote?product=${p.slug}`}>
                  Request a Quote
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

