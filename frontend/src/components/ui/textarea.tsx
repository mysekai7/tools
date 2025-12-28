import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-[18px] border border-slate-200/90 bg-white p-4 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
        'placeholder:text-slate-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-100 dark:shadow-inner dark:shadow-slate-950/40 dark:focus-visible:ring-offset-slate-950',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'min-h-[140px] md:min-h-[180px] lg:min-h-[220px] max-h-[45vh] resize-none',
        'font-mono',
        className
      )}
      {...props}
    />
  );
});
