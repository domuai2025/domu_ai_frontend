'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallback?: React.ReactNode;
  showSkeleton?: boolean;
  aspectRatio?: number;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallback,
  showSkeleton = true,
  aspectRatio,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [blur, setBlur] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setBlur(true);
  }, [src]);

  if (error) {
    return fallback || <div>Failed to load image</div>;
  }

  return (
    <div
      className={cn(
        'relative',
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
    >
      {isLoading && showSkeleton && (
        <Skeleton
          className="absolute inset-0 z-10"
          style={{ aspectRatio: aspectRatio }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          'transition-all duration-300',
          blur && 'scale-110 blur-lg',
          !isLoading && !blur && 'scale-100 blur-0'
        )}
        onLoadingComplete={() => {
          setIsLoading(false);
          setTimeout(() => setBlur(false), 50);
        }}
        onError={() => setError(new Error('Failed to load image'))}
        {...props}
      />
    </div>
  );
}