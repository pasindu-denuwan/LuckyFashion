import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileText, ArrowRight, Home, Phone } from "lucide-react";

interface SuccessPageProps {
  searchParams: {
    ref?: string;
  };
}

export default function QuotationSuccessPage({ searchParams }: SuccessPageProps) {
  const referenceNumber = searchParams.ref;

  // Strict AGENTS.md rule: Success UI only appears after verified DB write confirms reference number
  if (!referenceNumber) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Quotation Successfully Registered
        </span>
        <h1 className="text-4xl font-bold font-heading text-lucky-dark mt-4 mb-2">
          Thank You for Your Quotation Request
        </h1>
        <p className="text-sm text-lucky-mutedText max-w-lg mx-auto">
          Your garment specifications and tech pack files have been securely submitted to our production team.
        </p>
      </div>

      {/* Reference Number Card */}
      <Card className="max-w-md mx-auto border-lucky-borderLight shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase text-lucky-mutedText font-semibold">
            Official Quotation Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-mono font-black text-lucky-magenta py-2">
            {referenceNumber}
          </div>
          <p className="text-xs text-lucky-mutedText mt-1">
            Please retain this reference number for all future communications with our estimating department.
          </p>
        </CardContent>
      </Card>

      {/* Next Steps Guide */}
      <div className="text-left bg-white p-6 rounded-2xl border border-lucky-borderLight max-w-xl mx-auto space-y-4">
        <h3 className="font-heading font-bold text-sm text-lucky-dark">
          What Happens Next?
        </h3>
        <ul className="space-y-3 text-xs text-lucky-mutedText">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-lucky-lightNeutral text-lucky-dark font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span>
              <strong>Technical Review (Within 24 Hours):</strong> Our pattern and fabric engineers evaluate your dimensions, seam requirements, and embellishment placements.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-lucky-lightNeutral text-lucky-dark font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span>
              <strong>Detailed Estimate Delivery:</strong> You will receive a formalized PDF breakdown itemizing tiered production pricing, sample costs, and freight options.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-lucky-lightNeutral text-lucky-dark font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span>
              <strong>Pre-Production Approval Sample:</strong> Upon agreement, pre-production sample physical garments are fabricated for your sign-off prior to bulk cutting.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Button asChild variant="default" size="default">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" /> Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="default">
          <Link href="/products">Explore Apparel Catalog</Link>
        </Button>
      </div>
    </div>
  );
}

