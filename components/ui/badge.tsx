import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-lucky-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-lucky-blue text-white shadow hover:bg-blue-700",
        secondary:
          "border-transparent bg-lucky-lightNeutral text-lucky-dark hover:bg-slate-200 dark:bg-slate-800 dark:text-lucky-offwhite",
        destructive:
          "border-transparent bg-status-error text-white shadow hover:bg-red-700",
        outline: "text-lucky-dark dark:text-lucky-offwhite border-lucky-borderLight dark:border-slate-700",
        sample:
          "border-amber-300 bg-amber-50 text-amber-800 font-bold tracking-wide uppercase dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

