import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PublicationStatus = "draft" | "published" | "archived";
export type QuotationStatus =
  | "new"
  | "in_review"
  | "estimated"
  | "approved"
  | "rejected"
  | "archived";

interface StatusBadgeProps {
  status: PublicationStatus | QuotationStatus | string;
  isDemo?: boolean;
  className?: string;
}

export function StatusBadge({ status, isDemo, className }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case "published":
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "in_review":
      case "estimated":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "new":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
      case "draft":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800";
      case "archived":
        return "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "in_review":
        return "In Review";
      case "new":
        return "New Quote";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
          getStyle()
        )}
      >
        {getLabel()}
      </span>
      {isDemo && (
        <Badge variant="sample" className="text-[10px] py-0 px-1.5">
          Sample
        </Badge>
      )}
    </div>
  );
}

