'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface BlurImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  lowQualitySrc?: string;
  className?: string;
}

export function BlurImage({
  src,
  lowQualitySrc,
  alt,
  className,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true);
    setCurrentSrc(lowQualitySrc || src);
  }, [src, lowQualitySrc]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        {...props}
        src={currentSrc}
        alt={alt}
        className={cn(
          'duration-700 ease-in-out',
          isLoading
            ? 'scale-110 blur-2xl grayscale'
            : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => {
          setIsLoading(false);
          if (currentSrc !== src) {
            setCurrentSrc(src);
          }
        }}
      />
    </div>
  );
} 