'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntersection } from '@/hooks/use-intersection';
import { LoadingState } from '@/components/ui/loading-state';

interface InfiniteScrollProps<T> {
  items: T[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  loadingMessage?: string;
  threshold?: number;
}

export function InfiniteScroll<T>({
  items,
  loadMore,
  hasMore,
  renderItem,
  className,
  loadingMessage = 'Loading more items...',
  threshold = 0.5,
}: InfiniteScrollProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersection(loaderRef, {
    threshold,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      setIsLoading(true);
      loadMore().finally(() => setIsLoading(false));
    }
  }, [isIntersecting, hasMore, loadMore, isLoading]);

  return (
    <div className={className}>
      {items.map((item, index) => renderItem(item, index))}
      {(hasMore || isLoading) && (
        <div ref={loaderRef}>
          <LoadingState message={loadingMessage} />
        </div>
      )}
    </div>
  );
} 