'use client';

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface VirtualTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    title: string;
    width?: number;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }[];
  rowHeight?: number;
  className?: string;
  containerClassName?: string;
}

export function VirtualTable<T extends { id: string }>({
  data,
  columns,
  rowHeight = 40,
  className,
  containerClassName,
}: VirtualTableProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const totalHeight = virtualizer.getTotalSize();
  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn("overflow-auto border rounded-md", containerClassName)}
      style={{ height: '100%', maxHeight: '600px' }}
    >
      <Table className={className}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                style={{ width: column.width }}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <tr style={{ height: `${items[0]?.start ?? 0}px` }} />
          {items.map((virtualRow) => {
            const row = data[virtualRow.index];
            return (
              <TableRow
                key={row.id}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${row.id}-${String(column.key)}`}
                    style={{ width: column.width }}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          <tr style={{ height: `${totalHeight - (items[items.length - 1]?.end ?? 0)}px` }} />
        </TableBody>
      </Table>
    </div>
  );
}