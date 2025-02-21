"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10",
        success: 
          "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500 bg-green-500/10",
        warning:
          "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500 bg-yellow-500/10",
        info:
          "border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500 bg-blue-500/10",
      },
      size: {
        sm: "text-sm p-3",
        default: "text-base p-4",
        lg: "text-lg p-6",
      },
      animation: {
        none: "",
        slide: "animate-in slide-in-from-top-2",
        fade: "animate-in fade-in-50",
        bounce: "animate-bounce",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  onClose?: () => void;
  autoClose?: number; // Duration in ms
  showIcon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant, 
    size,
    animation,
    icon,
    onClose,
    autoClose,
    showIcon = true,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (autoClose && isVisible) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, autoClose);
        return () => clearTimeout(timer);
      }
    }, [autoClose, isVisible, onClose]);

    const getIcon = () => {
      if (icon) return icon;
      switch (variant) {
        case "destructive":
          return <XCircle className="h-4 w-4" />;
        case "success":
          return <CheckCircle2 className="h-4 w-4" />;
        case "warning":
          return <AlertCircle className="h-4 w-4" />;
        case "info":
          return <Info className="h-4 w-4" />;
        default:
          return null;
      }
    };

    if (!isVisible) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div
            ref={ref}
            role="alert"
            aria-live="polite"
            className={cn(alertVariants({ variant, size, animation }), className)}
            {...props}
          >
            {showIcon && getIcon()}
            {children}
            {onClose && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  onClose();
                }}
                className="absolute right-4 top-4 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close alert"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription }; 