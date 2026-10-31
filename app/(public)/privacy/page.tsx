import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-lucky-mutedText hover:text-lucky-blue transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-lucky-dark">
          Privacy Policy
        </h1>
        <p className="text-xs text-lucky-mutedText mt-1">
          Last revised: October 2026
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-lucky-dark leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading">1. Information We Collect</h2>
          <p className="text-sm text-lucky-mutedText">
            Lucky Fashion collects information you provide directly to us when you submit a quotation request or contact form. This includes your name, company name, email address, phone number, physical delivery address, and any design files or tech packs you upload.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading">2. Use of Design Files & Client Materials</h2>
          <p className="text-sm text-lucky-mutedText">
            Design files, logos, and technical specifications submitted via our quotation system are stored in secure private storage buckets and used solely to prepare manufacturing estimates and execute custom production runs. We do not publish or disclose customer-identifying artwork without explicit, confirmed permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading">3. Security & Data Protection</h2>
          <p className="text-sm text-lucky-mutedText">
            We implement strict technical and organizational measures, including Row Level Security (RLS) and encrypted transport, to protect all customer inquiries and manufacturing records against unauthorized access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading">4. Contacting Us</h2>
          <p className="text-sm text-lucky-mutedText">
            If you have questions regarding this Privacy Policy or your data, please contact us via our contact form or official email.
          </p>
        </section>
      </div>
    </div>
  );
}

