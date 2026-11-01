import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckCircle2, Sparkles, ArrowRight, ArrowUpRight, Filter } from "lucide-react";

const SAMPLE_PROJECTS = [
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
    client_type: "Athletic Event",
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

export default async function OurWorkPage({
  searchParams,
}: {
  searchParams: { client?: string };
}) {
  const selectedClient = searchParams.client;
  let projects = SAMPLE_PROJECTS;

  try {
    const supabase = createClient();
    let query = supabase
      .from("completed_orders")
      .select("*, categories(name)")
      .eq("status", "published");

    if (selectedClient) {
      query = query.eq("client_type", selectedClient);
    }

    const res = await query.order("created_at", { ascending: false });
    if (res.data && res.data.length > 0) {
      projects = res.data.map((p) => ({
        ...p,
        specs: ["Custom Mill Dyeing", "Precision Embellishment", "AQL 2.5 Quality Control"],
      }));
    } else if (selectedClient) {
      projects = SAMPLE_PROJECTS.filter((p) => p.client_type === selectedClient);
    }
  } catch {
    if (selectedClient) {
      projects = SAMPLE_PROJECTS.filter((p) => p.client_type === selectedClient);
    }
  }

  const clientTypes = ["Corporate Enterprise", "Athletic Event", "Private Fashion Brand", "Hospitality"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Editorial Header */}
      <div className="rounded-3xl bg-gradient-to-r from-lucky-dark to-lucky-darkCard p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border border-purple-900/60">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lucky-cream/20 text-lucky-cream text-xs font-bold border border-lucky-cream/30">
            <Sparkles className="w-3.5 h-3.5 text-lucky-cream" />
            <span>Proven Delivery & Case Studies</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            Our Work & Completed Production Runs
          </h1>
          <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
            Explore verified garment batches fabricated for retail fashion collections, corporate uniform fleets, and athletic tournaments. Every project demonstrates factory-floor excellence.
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-lucky-magenta/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-lucky-magenta" />
          <span className="text-xs uppercase font-bold tracking-wider text-lucky-mutedText">
            Filter by Client Sector
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/our-work"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !selectedClient
                ? "bg-lucky-dark text-lucky-cream shadow-xs"
                : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-lucky-lightNeutral"
            }`}
          >
            All Projects
          </Link>
          {clientTypes.map((client) => (
            <Link
              key={client}
              href={`/our-work?client=${encodeURIComponent(client)}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedClient === client
                  ? "bg-lucky-dark text-lucky-cream shadow-xs"
                  : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-lucky-lightNeutral"
              }`}
            >
              {client}
            </Link>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="group rounded-2xl bg-white border border-lucky-borderLight shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-lucky-lightNeutral/40">
                  <OptimizedImage
                    src={proj.cover_image_url || ""}
                    alt={proj.title}
                    width={500}
                    height={320}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-lucky-magenta border border-lucky-borderLight shadow-xs">
                      {proj.client_type}
                    </span>
                  </div>
                  {proj.is_demo && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="sample" className="bg-white/95">
                        Sample
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-lucky-dark group-hover:text-lucky-magenta transition-colors line-clamp-1">
                    <Link href={`/our-work/${proj.slug}`}>{proj.title}</Link>
                  </h3>
                  <p className="text-xs text-lucky-mutedText mt-2 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-lucky-borderLight/80 flex flex-wrap gap-1.5">
                    {proj.specs?.map((s: string) => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold text-lucky-dark bg-lucky-cream/60 px-2 py-0.5 rounded border border-lucky-borderLight"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-lucky-borderLight/80 flex items-center justify-between gap-3 mt-4">
                <Button asChild size="sm" variant="outline" className="w-1/2">
                  <Link href={`/our-work/${proj.slug}`}>Case Study</Link>
                </Button>
                <Button asChild size="sm" variant="default" className="w-1/2 shadow-xs">
                  <Link href={`/quote?project=${proj.slug}`}>
                    Request Quote Similar
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Portfolio Items Found"
          description="There are currently no published projects matching the selected category."
          icon={CheckCircle2}
          actionLabel="Show All Projects"
          actionHref="/our-work"
        />
      )}
    </div>
  );
}
