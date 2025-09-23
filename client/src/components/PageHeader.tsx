import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground" data-testid="page-title">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-2" data-testid="page-description">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2" data-testid="page-actions">
          {actions}
        </div>
      )}
    </div>
  );
}