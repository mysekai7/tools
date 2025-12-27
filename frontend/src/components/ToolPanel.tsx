import { ReactNode, useState, useEffect } from 'react';

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
    <div className="h-full flex flex-col p-4 md:p-6 bg-white dark:bg-gray-900 overflow-auto">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
            {description}
            {shortcut && (
              <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">{shortcut}</span>
            )}
          </p>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveGrid({ children, className = '' }: ResponsiveGridProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
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
  minHeight = 'min-h-[120px] md:min-h-[200px]'
}: TextAreaPanelProps) {
  return (
    <div className={`flex flex-col flex-1 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {actions}
      </div>
      <textarea
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`
          flex-1 w-full p-3 md:p-4
          border border-gray-300 dark:border-gray-600 rounded-lg
          resize-none font-mono text-sm
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${readOnly ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-800'}
          text-gray-900 dark:text-gray-100
          ${minHeight}
        `}
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
