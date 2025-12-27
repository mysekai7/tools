import { ReactNode } from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  category: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  tools: Tool[];
}
