import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: project } = await supabase
    .from("completed_orders")
    .select("title, description")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!project) {
    return { title: "Project Not Found | Lucky Fashion" };
  }

  return {
    title: `${project.title} | Case Study | Lucky Fashion`,
    description: project.description || "Portfolio production run manufactured by Lucky Fashion.",
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const supabase = createClient();

  const { data: project } = await supabase
    .from("completed_orders")
    .select("*, categories(name), completed_order_images(*)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!project) {
    notFound();
  }

  const specs = project.specifications || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <Link
          href="/our-work"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-lucky-mutedText hover:text-lucky-blue transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Completed Orders
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase text-lucky-blue">
            {project.client_type || project.categories?.name}
          </span>
          {project.is_demo && <Badge variant="sample">Sample</Badge>}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-lucky-dark">
          {project.title}
        </h1>
      </div>

      <div className="rounded-2xl overflow-hidden border border-lucky-borderLight bg-white shadow-sm">
        <OptimizedImage
          src={project.cover_image_url || ""}
          alt={project.title}
          width={1200}
          height={650}
          className="w-full h-[450px] object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-heading text-lucky-dark">
            Production Overview & Scope
          </h2>
          <p className="text-sm text-lucky-dark leading-relaxed whitespace-pre-line">
            {project.description}
          </p>

          {project.completed_order_images && project.completed_order_images.length > 0 && (
            <div className="pt-6 space-y-4">
              <h3 className="text-lg font-bold font-heading text-lucky-dark">
                Production Run Visuals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {project.completed_order_images.map((img: any) => (
                  <div
                    key={img.id}
                    className="rounded-xl overflow-hidden border border-lucky-borderLight"
                  >
                    <OptimizedImage
                      src={img.url}
                      alt={img.alt_text || project.title}
                      width={400}
                      height={280}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Specifications Sidebar */}
        <div className="p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-lg text-lucky-dark">
            Manufacturing Specs
          </h3>

          <div className="divide-y divide-lucky-borderLight text-xs">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="py-2.5 flex justify-between gap-4">
                <span className="font-semibold text-lucky-mutedText capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="font-medium text-lucky-dark text-right">
                  {String(val)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-lucky-borderLight space-y-3">
            <Button asChild size="default" className="w-full font-bold">
              <Link href={`/quote?project=${project.slug}`}>
                Request a Quote for Similar Garments
              </Link>
            </Button>
            <p className="text-[11px] text-lucky-mutedText text-center">
              Custom batches manufactured to your exact colorway and volume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

