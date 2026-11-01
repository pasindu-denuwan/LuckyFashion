"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  MessageSquare,
  ArrowRight,
  Shirt,
  Briefcase,
  Factory,
  Info,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  companyName: string;
  whatsapp?: string | null;
  categories?: { name: string; slug: string }[] | null;
}

export function PublicHeader({
  companyName,
  whatsapp,
  categories,
}: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Apparel Blanks", href: "/products", icon: Shirt },
    { label: "Our Work", href: "/our-work", icon: Briefcase },
    { label: "Manufacturing & FAQs", href: "/manufacturing", icon: Factory },
    { label: "About Factory", href: "/about", icon: Info },
    { label: "Contact", href: "/contact", icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-lucky-borderLight shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Sub-tag */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-lucky-dark flex items-center justify-center text-lucky-cream font-heading font-black text-xl shadow-xs group-hover:bg-lucky-darkCard transition">
            LF
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black font-heading tracking-tight text-lucky-dark leading-none">
              {companyName}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-lucky-mutedText mt-1">
              Apparel Manufacturing & Blanks
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-lucky-dark">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 transition-colors hover:text-lucky-magenta",
                  isActive
                    ? "text-lucky-magenta font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-lucky-magenta"
                    : "text-lucky-dark"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-lucky-dark bg-lucky-cream/80 px-3.5 py-2 rounded-lg border border-lucky-borderLight hover:bg-lucky-cream transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-lucky-magenta" />
              <span>WhatsApp Desk</span>
            </a>
          )}

          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex shadow-sm">
            <Link href="/quote" className="inline-flex items-center gap-1.5">
              <span>Request a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            className="lg:hidden p-2 rounded-lg text-lucky-dark hover:bg-lucky-lightNeutral transition focus:outline-none focus:ring-2 focus:ring-lucky-magenta"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-lucky-borderLight px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-lucky-lightNeutral text-lucky-magenta font-bold"
                      : "text-lucky-dark hover:bg-lucky-lightNeutral/50"
                  )}
                >
                  <Icon className="w-4 h-4 text-lucky-magenta" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-lucky-borderLight flex flex-col gap-2.5">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs font-bold text-lucky-dark bg-lucky-cream py-2.5 rounded-lg border border-lucky-borderLight"
              >
                <MessageSquare className="w-4 h-4 text-lucky-magenta" />
                <span>Chat via WhatsApp</span>
              </a>
            )}
            <Button asChild variant="default" className="w-full justify-center">
              <Link
                href="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
