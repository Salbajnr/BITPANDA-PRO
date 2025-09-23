import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  description?: string;
  icon?: LucideIcon;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
  loading?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  change, 
  className,
  loading = false 
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </CardTitle>
          {Icon && (
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          )}
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)} data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground" data-testid={`stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {change && (
            <span 
              className={cn(
                "font-medium",
                change.trend === 'up' && "text-green-600 dark:text-green-400",
                change.trend === 'down' && "text-red-600 dark:text-red-400",
                change.trend === 'neutral' && "text-muted-foreground"
              )}
              data-testid={`stat-change-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {change.trend === 'up' && '+'}
              {change.value}
            </span>
          )}
          {description && (
            <span data-testid={`stat-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {description}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}