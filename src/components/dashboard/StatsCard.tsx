import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  href?: string;
}

const variantStyles = {
  default: 'from-secondary to-muted',
  primary: 'from-blue-500/20 to-blue-600/5',
  success: 'from-green-500/20 to-green-600/5',
  warning: 'from-yellow-500/20 to-yellow-600/5',
  destructive: 'from-red-500/20 to-red-600/5',
};

const iconVariantStyles = {
  default: 'text-muted-foreground',
  primary: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  destructive: 'text-red-500',
};

export function StatsCard({ title, value, icon: Icon, trend, variant = 'default', href }: StatsCardProps) {
  const CardContent = (
    <div className={cn(
      'relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-lg',
      href && 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
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

  if (href) {
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
}
