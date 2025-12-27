import { ReactNode, useState, useEffect } from 'react';

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

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
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
      <main className="flex-1 overflow-auto relative">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            className="fixed top-4 left-4 z-30 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
