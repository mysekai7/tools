import { Tool } from '../types';
import { useTheme } from '../hooks';

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

  const handleToolSelect = (toolId: string) => {
    onSelectTool(toolId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`
        bg-gray-900 text-white h-full flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className={`p-4 border-b border-gray-700 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold">DevTools</h1>
            <p className="text-gray-400 text-sm mt-1">Developer Utilities</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`
                w-full flex items-center rounded-lg text-left transition-colors
                ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2'}
                ${activeTool === tool.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
              title={collapsed ? `${tool.name} - ${tool.description}` : undefined}
            >
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {tool.icon}
              </span>
              {!collapsed && (
                <div className="overflow-hidden">
                  <div className="font-medium truncate">{tool.name}</div>
                  <div className="text-xs text-gray-400 truncate">{tool.description}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-700 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}>
          {!collapsed && <span className="text-gray-500 text-xs">v1.0.0</span>}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
