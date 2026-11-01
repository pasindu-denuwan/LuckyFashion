import * as React from "react";
import Link from "next/link";
import { LucideIcon, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = PackageOpen,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-lucky-borderLight dark:border-slate-800 bg-white/50 dark:bg-lucky-darkCard/50 max-w-lg mx-auto my-6",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-lucky-lightNeutral dark:bg-slate-800 flex items-center justify-center text-lucky-mutedText mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-lg font-bold font-heading text-lucky-dark dark:text-lucky-offwhite mb-1">
        {title}
      </h4>
      <p className="text-sm text-lucky-mutedText max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild variant="default" size="sm">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button onClick={onAction} variant="default" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

