'use client';

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const statusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        online: "bg-green-50 text-green-700 border border-green-200",
        offline: "bg-red-50 text-red-700 border border-red-200",
        idle: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        loading: "bg-blue-50 text-blue-700 border border-blue-200",
      },
    },
    defaultVariants: {
      variant: "idle",
    },
  }
);

interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  loading?: boolean;
  pulseAnimation?: boolean;
}

export function StatusIndicator({
  className,
  variant,
  loading,
  pulseAnimation = true,
  children,
  ...props
}: StatusIndicatorProps) {
  return (
    <div className={cn(statusVariants({ variant }), className)} {...props}>
      {loading ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <div
          className={cn(
            "mr-1 h-2 w-2 rounded-full",
            {
              "bg-green-500": variant === "online",
              "bg-red-500": variant === "offline",
              "bg-yellow-500": variant === "idle",
              "bg-blue-500": variant === "loading",
            },
            pulseAnimation && "animate-pulse"
          )}
        />
      )}
      {children}
    </div>
  );
} 