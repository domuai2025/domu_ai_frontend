'use client';

import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes, ElementType } from "react";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, as: Component = "div", children, ...props }, ref) => {
    const Comp = Component as ElementType;
    return (
      <Comp
        ref={ref}
        className={cn("grid", className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Grid.displayName = "Grid"; 