
import React from 'react';
import { Card } from '@/components/ui/card';

interface LoadingCardProps {
  count?: number;
  height?: string;
}

export function LoadingCard({ count = 3, height = 'h-32' }: LoadingCardProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className={`${height} animate-pulse`}>
          <div className="h-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </Card>
      ))}
    </>
  );
}
