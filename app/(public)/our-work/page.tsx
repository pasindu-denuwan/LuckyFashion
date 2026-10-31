import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckCircle2 } from "lucide-react";

const SAMPLE_PROJECTS = [
  {
    id: "o1",
    title: "Enterprise Staff Uniform Program",
    slug: "enterprise-staff-uniform-program",
    client_type: "Corporate Enterprise",
    category_name: "Polo Shirts",
    description: "Engineered custom polo batch with high-density chest embroidery and dye-sublimated sleeve tipping for a multi-regional corporate rollout.",
    cover_image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
  },
  {
    id: "o2",
    title: "City Marathon Finisher Technical Shirts",
    slug: "city-marathon-finisher-technical-shirts",
    client_type: "Athletic Event",
    category_name: "Sportswear & Activewear",
    description: "Breathable lightweight finisher jerseys equipped with reflective safety transfers and colorfast all-over screen graphics.",
    cover_image_url: "https://images.unsplash.com/photo-1508215885820-4523e431397e?auto=format&fit=crop&w=800&q=80",
    is_demo: true,
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
        category_name: p.categories?.name,
      }));
    } else if (selectedClient) {
      projects = SAMPLE_PROJECTS.filter((p) => p.client_type === selectedClient);
    }
  } catch {
    if (selectedClient) {
      projects = SAMPLE_PROJECTS.filter((p) => p.client_type === selectedClient);
    }
  }

  const clientTypes = ["Corporate Enterprise", "Athletic Event", "Sports Club", "Hospitality"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-heading text-lucky-dark">
          Our Work & Production Portfolio
        </h1>
        <p className="text-sm text-lucky-mutedText mt-2 max-w-2xl">
          Real production runs manufactured for corporations, athletic teams, and event organizers.
        </p>
      </div>

      {/* Client Type Filter Pills */}
      <div className="flex flex-wrap gap-2 border-b border-lucky-borderLight pb-4">
        <Link
          href="/our-work"
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            !selectedClient
              ? "bg-lucky-dark text-white"
              : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-slate-50"
          }`}
        >
          All Projects
        </Link>
        {clientTypes.map((client) => (
          <Link
            key={client}
            href={`/our-work?client=${encodeURIComponent(client)}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedClient === client
                ? "bg-lucky-dark text-white"
                : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-slate-50"
            }`}
          >
            {client}
          </Link>
        ))}
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <Card
              key={proj.id}
              className="flex flex-col justify-between overflow-hidden hover:shadow-md transition"
            >
              <div>
                <OptimizedImage
                  src={proj.cover_image_url || ""}
                  alt={proj.title}
                  width={500}
                  height={320}
                  className="h-56 w-full object-cover"
                />
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center justify-between text-xs text-lucky-mutedText mb-2">
                    <span className="font-semibold text-lucky-blue uppercase">
                      {proj.client_type || proj.category_name}
                    </span>
                    {proj.is_demo && <Badge variant="sample">Sample</Badge>}
                  </div>
                  <CardTitle className="text-lg font-bold">
                    <Link
                      href={`/our-work/${proj.slug}`}
                      className="hover:text-lucky-blue transition"
                    >
                      {proj.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-3 mt-2 leading-relaxed">
                    {proj.description}
                  </CardDescription>
                </CardHeader>
              </div>

              <div className="p-6 pt-4 border-t border-lucky-borderLight flex items-center justify-between">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/our-work/${proj.slug}`}>Case Study</Link>
                </Button>
                <Button asChild size="sm" variant="default">
                  <Link href={`/quote?project=${proj.slug}`}>
                    Request Quote Similar
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Portfolio Items Found"
          description="There are currently no published projects matching the selected category."
          icon={CheckCircle2}
        />
      )}
    </div>
  );
}
