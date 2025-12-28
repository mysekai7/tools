import { ReactNode } from 'react';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Textarea } from './ui';

interface ToolPanelProps {
  title: string;
  description: string;
  shortcut?: string;
  children: ReactNode;
  actions?: ReactNode;
  error?: string;
}

export function ToolPanel({
  title,
  description,
  shortcut,
  children,
  actions,
  error
}: ToolPanelProps) {
  return (
    <Card className="h-full rounded-[28px] border border-slate-200/70 bg-white/95 shadow-[0_22px_65px_-40px_rgba(15,23,42,0.55)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/75">
      <CardHeader className="flex flex-col items-center justify-center gap-3 rounded-t-[28px] border-b border-slate-100/90 bg-slate-50/70 px-8 py-6 text-center dark:border-slate-800/70 dark:bg-slate-900/80">
        <div className="space-y-1">
          <CardTitle className="text-[22px] font-semibold text-slate-900 dark:text-slate-50">{title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{description}</span>
            {shortcut && <span className="text-xs text-slate-400">{shortcut}</span>}
          </CardDescription>
        </div>
        {actions && <div className="flex items-center justify-center gap-2">{actions}</div>}
      </CardHeader>

      {error && (
        <div className="mx-5 mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <CardContent className="flex flex-1 flex-col gap-4 min-h-0 px-6 py-5 lg:p-6">
        {children}
      </CardContent>
    </Card>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveGrid({ children, className = '' }: ResponsiveGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${className}`}>
      {children}
    </div>
  );
}

interface TextAreaPanelProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  actions?: ReactNode;
  minHeight?: string;
}

export function TextAreaPanel({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = '',
  actions,
  minHeight = 'min-h-[140px] md:min-h-[180px] lg:min-h-[220px] max-h-[45vh]'
}: TextAreaPanelProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-[22px] border border-slate-200/90 bg-white/95 p-4 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.55)] dark:border-slate-800/80 dark:bg-slate-900/60 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</label>
        {actions}
      </div>
      <Textarea
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${minHeight} ${readOnly ? 'bg-slate-50 dark:bg-slate-900/50' : ''}`}
      />
    </div>
  );
}

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className = '' }: ButtonGroupProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 md:gap-3 ${className}`}>
      {children}
    </div>
  );
}
