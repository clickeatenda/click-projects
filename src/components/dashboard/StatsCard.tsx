import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

const variantStyles = {
  default: 'from-secondary to-muted',
  primary: 'from-primary/20 to-primary/5',
  success: 'from-success/20 to-success/5',
  warning: 'from-warning/20 to-warning/5',
  destructive: 'from-destructive/20 to-destructive/5',
};

const iconVariantStyles = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

export function StatsCard({ title, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-lg',
    )}>
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        variantStyles[variant]
      )} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className={cn('h-5 w-5', iconVariantStyles[variant])} />
        </div>
        
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {trend && (
            <span className={cn(
              'mb-1 text-sm font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
