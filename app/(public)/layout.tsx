import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, ArrowRight, MessageSquare } from "lucide-react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: any = null;
  let categories: any[] | null = null;

  try {
    const supabase = createClient();
    const [settingsRes, categoriesRes] = await Promise.all([
      supabase.from("business_settings").select("*").eq("id", "default").single(),
      supabase.from("categories").select("name, slug").eq("is_active", true).order("sort_order"),
    ]);
    settings = settingsRes.data;
    categories = categoriesRes.data;
  } catch {
    // Safe fallback to defaults
  }

  const companyName = settings?.company_name || "Lucky Fashion";
  const phone = settings?.phone || "+1 (555) 019-2834";
  const email = settings?.email || "inquiries@luckyfashion.com";
  const address = settings?.address || "100 Industrial Parkway, Garment District";
  const whatsapp = settings?.whatsapp;

  return (
    <div className="min-h-screen flex flex-col bg-lucky-offwhite text-lucky-dark">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-lucky-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold font-heading tracking-tight text-lucky-dark">
              {companyName}
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-lucky-cream text-lucky-dark border border-lucky-borderLight">
              Manufacturing
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-lucky-dark">
            <Link href="/products" className="hover:text-lucky-magenta transition">
              Products
            </Link>
            <Link href="/our-work" className="hover:text-lucky-magenta transition">
              Our Work
            </Link>
            <Link href="/manufacturing" className="hover:text-lucky-magenta transition">
              Manufacturing & FAQs
            </Link>
            <Link href="/about" className="hover:text-lucky-magenta transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-lucky-magenta transition">
              Contact
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-lucky-dark bg-lucky-cream px-3.5 py-1.5 rounded-full border border-lucky-borderLight hover:bg-[#e4d79b] transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-lucky-magenta" />
                <span>WhatsApp</span>
              </a>
            )}
            <Button asChild variant="default" size="sm">
              <Link href="/quote">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Public Page Content */}
      <div className="flex-1">{children}</div>

      {/* Public Footer (#290044 background with #EEE3B0 accents) */}
      <footer className="bg-lucky-dark text-purple-200 border-t border-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Company Profile */}
            <div className="space-y-4">
              <span className="text-2xl font-bold font-heading text-lucky-cream">
                {companyName}
              </span>
              <p className="text-xs text-purple-300 leading-relaxed">
                Precision custom apparel manufacturing, uniform fabrication, and garment solutions for brands, corporations, and sports institutions.
              </p>
              <div className="pt-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href="/quote">
                    Request a Quote <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Column 2: Apparel Lines */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-lucky-cream mb-4">
                Apparel Lines
              </h4>
              <ul className="space-y-2 text-xs">
                {categories && categories.length > 0 ? (
                  categories.slice(0, 5).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className="hover:text-lucky-cream transition"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link href="/products" className="hover:text-lucky-cream transition">T-Shirts</Link></li>
                    <li><Link href="/products" className="hover:text-lucky-cream transition">Polo Shirts</Link></li>
                    <li><Link href="/products" className="hover:text-lucky-cream transition">Hoodies & Sweatshirts</Link></li>
                    <li><Link href="/products" className="hover:text-lucky-cream transition">Corporate Uniforms</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 3: Quick Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-lucky-cream mb-4">
                Explore
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/our-work" className="hover:text-lucky-cream transition">Our Work (Portfolio)</Link></li>
                <li><Link href="/manufacturing" className="hover:text-lucky-cream transition">Manufacturing & FAQs</Link></li>
                <li><Link href="/about" className="hover:text-lucky-cream transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-lucky-cream transition">Contact Factory</Link></li>
                <li><Link href="/privacy" className="hover:text-lucky-cream transition">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Information */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-lucky-cream mb-4">
                Get In Touch
              </h4>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-lucky-cream shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-lucky-cream shrink-0" />
                  <span>{phone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-lucky-cream shrink-0" />
                  <span>{email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-950 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-purple-400">
            <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-lucky-cream transition">
                Privacy Policy
              </Link>
              <Link href="/admin/login" className="hover:text-lucky-cream transition">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
