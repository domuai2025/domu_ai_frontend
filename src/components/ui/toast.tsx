import { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import { Toaster } from 'sonner';

export interface ToastProps {
  id?: string;
  className?: string;
  description?: ReactNode;
  duration?: number;
  variant?: 'default' | 'destructive';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ToastActionElement = React.ReactElement;

export const useToast = () => {
  return {
    toast: sonnerToast
  };
};

export const ToastProvider = () => <Toaster />;
export const toast = sonnerToast;