import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-lucky-lightNeutral flex items-center justify-center text-lucky-mutedText font-mono font-bold text-xl mb-4">
        404
      </div>
      <h1 className="text-3xl font-bold font-heading text-lucky-dark mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-lucky-mutedText mb-8">
        The requested apparel page, portfolio item, or document could not be located or may have been unpublished.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild variant="default" size="default">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" /> Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="default">
          <Link href="/products">
            Explore Catalog
          </Link>
        </Button>
      </div>
    </div>
  );
}

