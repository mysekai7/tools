import { Tool } from '../types';
import { useTheme } from '../hooks';
import { Badge, Button, ScrollArea, Switch, Tooltip } from './ui';
import { useMemo } from 'react';

interface SidebarProps {
  tools: Tool[];
  activeTool: string;
  onSelectTool: (toolId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  tools,
  activeTool,
  onSelectTool,
  collapsed,
  onToggleCollapse,
  isMobile,
  onClose
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const appVersion = (import.meta as any).env?.VITE_APP_VERSION || 'dev';

  const categories = useMemo(() => {
    const order = ['encoding', 'format', 'crypto'];
    const labels: Record<string, string> = {
      encoding: 'Encoding',
      format: 'Format',
      crypto: 'Crypto',
    };
    const grouped: Record<string, Tool[]> = {};
    tools.forEach((tool) => {
      const key = tool.category || 'others';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(tool);
    });

    return order
      .filter((id) => grouped[id])
      .map((id) => ({ id, label: labels[id] || id, items: grouped[id] }))
      .concat(
        Object.keys(grouped)
          .filter((id) => !order.includes(id))
          .map((id) => ({ id, label: labels[id] || id, items: grouped[id] }))
      );
  }, [tools]);

  const handleToolSelect = (toolId: string) => {
    onSelectTool(toolId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`
        relative h-full flex flex-col border-r ${isLight ? 'border-slate-200/80 bg-white/85 text-slate-900' : 'border-slate-800/80 bg-slate-900/70 text-slate-100'}
        backdrop-blur-xl shadow-2xl shadow-black/20
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[88px]' : 'w-72'}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(59,130,246,0.08),transparent),linear-gradient(240deg,rgba(14,165,233,0.04),transparent)]" />

      {/* Header */}
      <div className={`relative flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">DevTools</h1>
            </div>
            <p className="text-xs text-slate-400">Developer utilities toolkit</p>
          </div>
        )}
        <Tooltip content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white"
          >
            <svg
              className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </Button>
        </Tooltip>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 pb-4">
        <ScrollArea className="h-full">
          <div className="space-y-3">
            {categories.map((group) => (
              <div key={group.id} className="space-y-2">
                {!collapsed && (
                  <div className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {group.label}
                  </div>
                )}
                <div className="space-y-2">
                  {group.items.map((tool) => {
                    const active = activeTool === tool.id;
                    const button = (
                      <div
                        key={tool.id}
                        onClick={() => handleToolSelect(tool.id)}
                        className={`
                          group flex w-full cursor-pointer items-center rounded-2xl border px-3 py-3 transition shadow-sm
                          ${active
                            ? isLight
                              ? 'border-blue-500/60 bg-blue-50 text-blue-700 shadow-[0_12px_40px_-18px_rgba(59,130,246,0.35)]'
                              : 'border-blue-500/40 bg-blue-500/10 text-white shadow-[0_12px_40px_-20px_rgba(59,130,246,0.6)]'
                            : isLight
                              ? 'border-slate-200/90 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/60'
                              : 'border-slate-800/70 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/70'
                          }
                          ${collapsed ? 'justify-center' : 'gap-3'}
                        `}
                      >
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-inner shadow-black/5 ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800/80 text-slate-200'}`}>
                          {tool.icon}
                        </span>
                        {!collapsed && (
                          <div className="overflow-hidden">
                            <div className="truncate text-sm font-semibold">{tool.name}</div>
                            <div className="truncate text-xs text-slate-400">{tool.description}</div>
                          </div>
                        )}
                      </div>
                    );

                    if (collapsed) {
                      return (
                        <Tooltip key={tool.id} content={`${tool.name} · ${tool.description}`} side="right">
                          {button}
                        </Tooltip>
                      );
                    }

                    return button;
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </nav>

      {/* Footer */}
      <div className={`relative border-t ${isLight ? 'border-slate-200/80' : 'border-slate-800/80'} px-4 py-4`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between gap-2'}`}>
          {!collapsed && <span className="text-xs text-slate-500">v{appVersion} · {theme === 'light' ? 'Light' : 'Dark'} mode</span>}
          <div className="flex items-center gap-2">
            {!collapsed && <span className="text-xs text-slate-400">Theme</span>}
            <Tooltip content={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
