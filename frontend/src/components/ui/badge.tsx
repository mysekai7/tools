import * as React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'primary' | 'muted' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-100 dark:border-blue-500/40',
  muted: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700/60',
  outline: 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-100',
};

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
