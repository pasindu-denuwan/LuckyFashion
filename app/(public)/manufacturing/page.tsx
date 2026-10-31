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
import { CheckCircle2, Cog, Layers, Scissors, Shield } from "lucide-react";

export default async function ManufacturingPage() {
  const supabase = createClient();

  const { data: contentRecord } = await supabase
    .from("website_content")
    .select("content")
    .eq("page_key", "manufacturing")
    .single();

  const content = contentRecord?.content || {};
  const title = content.title || "Manufacturing Capabilities & Quality Control";
  const intro =
    content.intro ||
    "From yarn selection and pattern making to laser cutting, screen printing, embroidery, and packaging — every step is handled under rigorous standards.";
  const faqs = content.faqs || [
    {
      question: "How do quotation requests work?",
      answer:
        "Submit your required quantities, preferred fabric, and design files via our Request a Quote form. Our team reviews specifications and responds with a detailed quotation within 24 to 48 hours.",
    },
    {
      question: "What custom embellishment options do you support?",
      answer:
        "We support silkscreen printing (water-base, plastisol, discharge), direct-to-garment (DTG), high-density embroidery, dye sublimation, woven labeling, and custom trims.",
    },
    {
      question: "Do you provide sample production before mass fabrication?",
      answer:
        "Yes. Upon quotation confirmation, we produce pre-production approval samples to ensure fabric hand-feel, dimensions, and embellishments meet exact requirements.",
    },
    {
      question: "Can we source custom proprietary fabrics?",
      answer:
        "Yes. We collaborate directly with textile mills to knit and dye custom GSM weights, moisture-wicking finishes, organic cottons, and custom colorways.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-lucky-blue">
          Production Excellence
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-lucky-dark mt-2 mb-4">
          {title}
        </h1>
        <p className="text-lg text-lucky-mutedText leading-relaxed">
          {intro}
        </p>
      </div>

      {/* Capabilities Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            step: "01",
            title: "Material Sourcing",
            description: "Lab-dip color testing, shrinkage pre-shrink wash, and yarn twist strength analysis.",
            icon: Layers,
          },
          {
            step: "02",
            title: "Precision Cutting",
            description: "Automated Gerber CAD spreading and laser contour slicing for consistent pattern accuracy.",
            icon: Scissors,
          },
          {
            step: "03",
            title: "Assembly & Sewing",
            description: "High-spec 4-thread overlock, flatlock, and twin-needle coverstitching machines.",
            icon: Cog,
          },
          {
            step: "04",
            title: "Inspection & Ironing",
            description: "Garment steam tunnel pressing, needle detection scanning, and custom barcoded packaging.",
            icon: Shield,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-white border border-lucky-borderLight shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center text-lucky-blue">
                <Icon className="w-5 h-5" />
                <span className="text-xs font-mono font-bold">{item.step}</span>
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

      {/* FAQs Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-lucky-borderLight shadow-sm space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-heading text-lucky-dark">
            Manufacturing & Ordering FAQs
          </h2>
          <p className="text-xs text-lucky-mutedText mt-1">
            Common questions regarding quotation lead times, artwork specs, and production runs.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq: any, idx: number) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-base font-bold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Quote Banner */}
      <div className="rounded-3xl bg-lucky-blue text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold font-heading">Have Custom Technical Specifications?</h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Our pattern makers and fabric consultants review all requirements within 24 to 48 hours.
          </p>
        </div>
        <Button asChild size="lg" className="bg-white text-lucky-blue hover:bg-slate-100 font-bold shrink-0">
          <Link href="/quote">Request a Quote</Link>
        </Button>
      </div>
    </div>
  );
}

