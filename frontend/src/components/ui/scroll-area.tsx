import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '../../lib/utils';

export function ScrollArea({ className, children, ...props }: ScrollAreaPrimitive.ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        className="flex touch-none select-none p-0.5 transition-colors data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-slate-700" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner className="bg-slate-800" />
    </ScrollAreaPrimitive.Root>
  );
}
