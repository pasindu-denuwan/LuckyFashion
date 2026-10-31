import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lucky-magenta focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-lucky-magenta text-white shadow-sm hover:bg-[#731f64] active:bg-[#5b174e]",
        destructive: "bg-status-error text-white shadow-sm hover:bg-rose-700 active:bg-rose-800",
        outline:
          "border border-lucky-borderLight bg-white hover:bg-lucky-lightNeutral text-lucky-dark dark:border-purple-900/60 dark:bg-lucky-dark dark:text-lucky-cream",
        secondary:
          "bg-lucky-cream text-lucky-dark font-bold hover:bg-[#e4d79b] active:bg-[#dacb88]",
        ghost: "hover:bg-lucky-lightNeutral text-lucky-dark hover:text-lucky-magenta dark:text-lucky-cream",
        link: "text-lucky-magenta underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
