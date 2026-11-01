import React from "react";
import { createClient } from "@/lib/supabase/server";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Cog, Layers, Scissors, Shield, Sparkles, ArrowRight } from "lucide-react";

export default async function ManufacturingPage() {
  const supabase = createClient();

  const { data: contentRecord } = await supabase
    .from("website_content")
    .select("content")
    .eq("page_key", "manufacturing")
    .single();

  const content = contentRecord?.content || {};
  const title = content.title || "Manufacturing Capabilities, Quality Control & FAQs";
  const intro =
    content.intro ||
    "From yarn selection and pattern plotting to automated cutting, Tajima embroidery, discharge screen printing, and packaging — every step is calibrated for zero-defect execution.";
  const faqs = content.faqs || [
    {
      question: "How do custom quotation requests work?",
      answer:
        "Submit your required quantities, preferred fabric, and design files via our Request a Quote portal. Our technical team reviews the specifications and responds with a formal proposal within 24 to 48 hours.",
    },
    {
      question: "What custom embellishment options do you support?",
      answer:
        "We support silkscreen printing (water-based, discharge, and high-solid stretch plastisol), high-density 3D Tajima embroidery, Direct-to-Film (DTF), silicone heat transfers, woven damask labeling, and custom trims.",
    },
    {
      question: "Do you provide physical sample production before mass fabrication?",
      answer:
        "Yes, absolutely. Upon quotation confirmation, we produce complete pre-production physical prototypes to ensure fabric hand-feel, dimensions, and embellishments meet exact requirements before proceeding to bulk fabric spreading and stitching.",
    },
    {
      question: "Can we source custom proprietary fabrics and Pantone color matching?",
      answer:
        "Yes. We collaborate directly with textile mills to knit and dye custom GSM weights, moisture-wicking finishes, combed cottons, and precise Pantone PMS colorways with lab-dip approval.",
    },
    {
      question: "What are your standard production and delivery timelines?",
      answer:
        "Standard production runs typically take 14 to 21 working days following pre-production sample sign-off. Expedited delivery schedules (7 to 12 days) are available for time-sensitive corporate and tournament events.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="rounded-3xl bg-gradient-to-r from-lucky-dark to-lucky-darkCard p-8 sm:p-14 text-white relative overflow-hidden shadow-lg border border-purple-900/60">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lucky-cream/20 text-lucky-cream text-xs font-bold border border-lucky-cream/30">
            <Sparkles className="w-3.5 h-3.5 text-lucky-cream" />
            <span>Production Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-lucky-magenta/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Capabilities Process Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-lucky-magenta">
            Factory Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-lucky-dark mt-1">
            4-Stage Manufacturing Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Material Sourcing & Lab Dip",
              description: "Pantone color matching, shrinkage pre-wash testing, and yarn twist strength analysis under D65 daylight.",
              icon: Layers,
            },
            {
              step: "02",
              title: "Precision Plotting & Cutting",
              description: "Automated Gerber CAD spreading and laser contour slicing for consistent zero-defect pattern accuracy.",
              icon: Scissors,
            },
            {
              step: "03",
              title: "Assembly & Seam Joining",
              description: "High-spec 4-thread overlock, flatlock anti-chafing, and twin-needle coverstitching machines.",
              icon: Cog,
            },
            {
              step: "04",
              title: "Inspection & Finishing",
              description: "Garment steam pressing, needle detection scanning, custom damask relabeling, and barcoded retail packaging.",
              icon: Shield,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex justify-between items-center text-lucky-magenta">
                  <div className="w-10 h-10 rounded-xl bg-lucky-cream flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-lucky-mutedText">{item.step}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-lucky-dark">
                  {item.title}
                </h3>
                <p className="text-xs text-lucky-mutedText leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-lucky-borderLight shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-lucky-magenta">
            Buyer Reassurance
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-lucky-dark mt-1">
            Manufacturing & Ordering FAQs
          </h2>
          <p className="text-xs text-lucky-mutedText mt-1">
            Transparent answers regarding quotation lead times, artwork specs, and production runs.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq: any, idx: number) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="bg-lucky-offwhite/50 border border-lucky-borderLight rounded-xl px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-lucky-dark hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-lucky-mutedText leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Quote Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-lucky-dark to-lucky-darkCard text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-purple-900/60">
        <div className="max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-lucky-cream">
            Have Custom Technical Specifications?
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 mt-2 leading-relaxed">
            Our pattern makers and fabric consultants review all requirements within 24 to 48 hours.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary" className="font-bold text-lucky-dark shadow-md shrink-0">
          <Link href="/quote" className="flex items-center gap-2">
            <span>Request a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
