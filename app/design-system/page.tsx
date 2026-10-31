"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Shirt, Sparkles } from "lucide-react";

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const colors = [
    { name: "Deep Royal Plum", hex: "#290044", token: "lucky-dark", bg: "bg-[#290044]", text: "text-[#EEE3B0]" },
    { name: "Rich Violet", hex: "#500071", token: "lucky-darkCard", bg: "bg-[#500071]", text: "text-[#EEE3B0]" },
    { name: "Berry Magenta", hex: "#8A2A78", token: "lucky-magenta", bg: "bg-[#8A2A78]", text: "text-white" },
    { name: "Warm Cream Gold", hex: "#EEE3B0", token: "lucky-cream", bg: "bg-[#EEE3B0]", text: "text-[#290044]" },
    { name: "Soft Canvas Cream", hex: "#FAF7EE", token: "lucky-offwhite", bg: "bg-[#FAF7EE]", text: "text-[#290044]" },
    { name: "Muted Plum Gray", hex: "#6E5B70", token: "lucky-mutedText", bg: "bg-[#6E5B70]", text: "text-white" },
    { name: "Cream Border Light", hex: "#E5DBBF", token: "lucky-borderLight", bg: "bg-[#E5DBBF]", text: "text-[#290044]" },
  ];

  return (
    <div className="min-h-screen bg-lucky-offwhite text-lucky-dark py-12 px-6 max-w-6xl mx-auto">
      <header className="mb-12 pb-6 border-b border-lucky-borderLight">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lucky-lightNeutral text-xs font-semibold text-lucky-mutedText mb-3">
          <span>Internal Reference</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-2">Lucky Fashion Design System</h1>
        <p className="text-lucky-mutedText">
          Foundation tokens, accessible primitives, and UI components built with Tailwind & Radix.
        </p>
      </header>

      {/* 1. Color Palette Tokens */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">1. Brand Palette Tokens</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {colors.map((c) => (
            <div key={c.hex} className="rounded-xl border border-lucky-borderLight bg-white p-3 shadow-sm">
              <div className={`h-16 rounded-lg ${c.bg} ${c.text} flex items-center justify-center font-mono text-xs font-semibold mb-2 shadow-inner`}>
                {c.hex}
              </div>
              <div className="text-xs font-bold">{c.name}</div>
              <div className="text-[11px] text-lucky-mutedText font-mono">{c.token}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Scale */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">2. Typography Scale</h2>
        <div className="space-y-4 bg-white p-6 rounded-xl border border-lucky-borderLight">
          <div>
            <span className="text-xs text-lucky-mutedText uppercase font-mono">Heading 1 (Space Grotesk - 36px)</span>
            <h1 className="text-4xl font-bold font-heading">Engineered Custom Apparel Manufacturing</h1>
          </div>
          <div>
            <span className="text-xs text-lucky-mutedText uppercase font-mono">Heading 2 (Space Grotesk - 30px)</span>
            <h2 className="text-3xl font-bold font-heading">B2B Uniform Fabrication Solutions</h2>
          </div>
          <div>
            <span className="text-xs text-lucky-mutedText uppercase font-mono">Heading 3 (Space Grotesk - 24px)</span>
            <h3 className="text-2xl font-bold font-heading">High-Performance Knits & Technical Fabrics</h3>
          </div>
          <div>
            <span className="text-xs text-lucky-mutedText uppercase font-mono">Body Regular (Manrope - 16px)</span>
            <p className="text-base text-lucky-mutedText leading-relaxed">
              Lucky Fashion provides end-to-end textile design, pattern generation, yarn selection, precision laser cutting, and multi-color screen printing.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Buttons & Actions */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">3. Buttons & Interactive States</h2>
        <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-xl border border-lucky-borderLight">
          <Button variant="default">Request a Quote (Default)</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Delete Item</Button>
          <Button variant="default" size="sm">Small Size</Button>
          <Button variant="default" size="lg">Large Hero CTA</Button>
          <Button disabled>Disabled State</Button>
        </div>
      </section>

      {/* 4. Badges & Status Indicators */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">4. Status & Sample Badges</h2>
        <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-xl border border-lucky-borderLight">
          <StatusBadge status="published" />
          <StatusBadge status="draft" />
          <StatusBadge status="archived" />
          <StatusBadge status="new" />
          <StatusBadge status="in_review" />
          <StatusBadge status="approved" />
          <StatusBadge status="rejected" />
          <StatusBadge status="published" isDemo />
          <Badge variant="sample">Sample Watermark</Badge>
        </div>
      </section>

      {/* 5. Cards & Containers */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">5. Product / Item Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <StatusBadge status="published" isDemo />
                <Badge variant="secondary">T-Shirts</Badge>
              </div>
              <CardTitle>Combed Cotton Crewneck</CardTitle>
              <CardDescription>180 GSM Ring-Spun Pre-Shrunk Fabric</CardDescription>
            </CardHeader>
            <CardContent>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                alt="Cotton Crewneck"
                width={400}
                height={260}
                className="h-44 w-full rounded-lg object-cover"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-xs text-lucky-mutedText">Sizes: XS - 3XL</span>
              <Button size="sm" variant="default">Request a Quote</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <StatusBadge status="published" isDemo />
                <Badge variant="secondary">Polo Shirts</Badge>
              </div>
              <CardTitle>Premium Pique Corporate Polo</CardTitle>
              <CardDescription>220 GSM Heavyweight Double Pique</CardDescription>
            </CardHeader>
            <CardContent>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80"
                alt="Pique Corporate Polo"
                width={400}
                height={260}
                className="h-44 w-full rounded-lg object-cover"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-xs text-lucky-mutedText">Sizes: S - 3XL</span>
              <Button size="sm" variant="default">Request a Quote</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton Placeholder State</CardTitle>
              <CardDescription>Loading preview state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-28 rounded-md" />
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 6. Accordions (FAQ format) */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">6. Accordion (Manufacturing FAQs)</h2>
        <div className="bg-white p-6 rounded-xl border border-lucky-borderLight">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the turnaround timeline for custom orders?</AccordionTrigger>
              <AccordionContent>
                Standard production lead time typically ranges between 2 to 4 weeks depending on the order quantity, material availability, and customization technique.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can we inspect physical samples before full production?</AccordionTrigger>
              <AccordionContent>
                Yes. Pre-production approval samples are provided to confirm fabric weight, dye-lot consistency, sizing, and embroidery precision.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 7. Dialog & Empty States */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-heading mb-6">7. Modal & Empty State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-white p-6 rounded-xl border border-lucky-borderLight text-center">
            <h3 className="font-heading font-bold text-lg mb-2">Accessible Radix Dialog</h3>
            <p className="text-sm text-lucky-mutedText mb-4">Focus-trapped modal dialog with smooth backdrop transition.</p>
            <Button onClick={() => setModalOpen(true)}>Open Quotation Modal</Button>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Custom Quotation</DialogTitle>
                  <DialogDescription>
                    Provide your garment specifications and our production team will prepare a formal estimate.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 text-sm text-lucky-mutedText">
                  This dialog traps focus, handles ESC key closing, and is announced to assistive technologies.
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="default" onClick={() => setModalOpen(false)}>Proceed to Quote</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white p-4 rounded-xl border border-lucky-borderLight">
            <EmptyState
              title="No Products Found"
              description="There are currently no published products matching the selected filter criteria."
              icon={Shirt}
              actionLabel="Reset Filters"
              onAction={() => alert("Filters reset")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

