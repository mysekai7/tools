import { ReactNode, useState, useEffect } from 'react';
import { Button } from './ui';
import { useTheme } from '../hooks';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Layout({
  sidebar,
  children,
  sidebarCollapsed,
  onToggleSidebar,
  mobileOpen,
  onMobileClose
}: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        onMobileClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileOpen, onMobileClose]);

  const isLight = theme === 'light';

  return (
    <div className={`relative min-h-screen overflow-hidden ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        {isLight ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_70%_10%,rgba(14,165,233,0.08),transparent_25%)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_70%_10%,rgba(79,70,229,0.1),transparent_25%)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-slate-900" />
          </>
        )}
      </div>

      <div className="relative flex min-h-screen">
        {/* Mobile overlay backdrop */}
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
        )}

        {/* Sidebar - Desktop */}
        {!isMobile && (
          <div className="flex-shrink-0">
            {sidebar}
          </div>
        )}

        {/* Sidebar - Mobile (overlay) */}
        {isMobile && (
          <div
            className={`
              fixed inset-y-0 left-0 z-50
              transform transition-transform duration-300 ease-in-out
              ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            {sidebar}
          </div>
        )}

        {/* Main content */}
        <main className="relative flex-1 overflow-auto min-h-screen">
          {/* Mobile menu button */}
          {isMobile && (
            <Button
              onClick={onToggleSidebar}
              variant="secondary"
              size="icon"
              className="fixed left-4 top-4 z-30"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          )}
          <div className="p-4 md:p-8 min-h-[calc(100vh-48px)]">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
