
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'error' | 'warning';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default'
}: EmptyStateProps) {
  const colors = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-400',
    error: 'bg-red-100 dark:bg-red-900/20 text-red-600',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600'
  };

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className={`w-16 h-16 ${colors[variant]} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </CardContent>
    </Card>
  );
}
