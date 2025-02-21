'use client';

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';
import styles from './virtual-list.module.css';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  height: number;
  itemHeight?: number;
  className?: string;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  height,
  itemHeight = 40,
  className,
  overscan = 5,
}: VirtualListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    size: items.length,
    parentRef,
    estimateSize: React.useCallback(() => itemHeight, [itemHeight]),
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className={cn(styles.container, className)}
      style={{ height }}
    >
      <div
        className={styles.virtualList}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            className={styles.virtualRow}
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderItem(items[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
}