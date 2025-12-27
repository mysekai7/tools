import { useState, useEffect } from 'react';
import { Layout, Sidebar } from './components';
import { Base64Tool, UrlTool, HashTool, JsonTool, JwtTool, YamlTool, RsaTool, DiffTool } from './tools';
import { Tool } from './types';

// Tool configurations
const tools: Tool[] = [
  {
    id: 'base64',
    name: 'Base64',
    description: 'Encode/Decode',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    category: 'encoding',
  },
  {
    id: 'url',
    name: 'URL Encode',
    description: 'Encode/Decode',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    category: 'encoding',
  },
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description: 'Decode & Inspect',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    category: 'encoding',
  },
  {
    id: 'hash',
    name: 'Hash',
    description: 'MD5/SHA1/SHA256',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    category: 'crypto',
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Pretty/Minify',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    category: 'format',
  },
  {
    id: 'yaml',
    name: 'YAML',
    description: 'Pretty & Convert',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    category: 'format',
  },
  {
    id: 'rsa',
    name: 'RSA',
    description: 'Encrypt/Decrypt',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    category: 'crypto',
  },
  {
    id: 'diff',
    name: 'Diff',
    description: 'Text Compare',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    category: 'format',
  },
];

// Tool component map
const toolComponents: Record<string, React.FC> = {
  base64: Base64Tool,
  url: UrlTool,
  jwt: JwtTool,
  hash: HashTool,
  json: JsonTool,
  yaml: YamlTool,
  rsa: RsaTool,
  diff: DiffTool,
};

function App() {
  const [activeTool, setActiveTool] = useState('base64');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleToggleSidebar = () => {
    // On mobile, toggle the overlay
    if (window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
    } else {
      // On desktop, toggle collapse
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  const ActiveToolComponent = toolComponents[activeTool];

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={handleToggleSidebar}
      mobileOpen={mobileOpen}
      onMobileClose={handleMobileClose}
      sidebar={
        <Sidebar
          tools={tools}
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={window.innerWidth < 768}
          onClose={handleMobileClose}
        />
      }
    >
      {ActiveToolComponent ? (
        <ActiveToolComponent />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg">Tool not implemented yet</p>
            <p className="text-sm mt-2">Coming soon...</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
