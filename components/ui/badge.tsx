import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-lucky-magenta focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-lucky-magenta text-white shadow hover:bg-[#731f64]",
        secondary:
          "border-transparent bg-lucky-cream text-lucky-dark font-medium hover:bg-[#e4d79b]",
        destructive:
          "border-transparent bg-status-error text-white shadow hover:bg-rose-700",
        outline: "text-lucky-dark dark:text-lucky-cream border-lucky-borderLight",
        sample:
          "border-[#8A2A78]/40 bg-[#8A2A78]/10 text-lucky-magenta font-bold tracking-wide uppercase",
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
