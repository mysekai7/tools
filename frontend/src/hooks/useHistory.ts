import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
  id: string;
  toolId: string;
  input: string;
  output: string;
  operation: string;
  timestamp: number;
}

const HISTORY_KEY = 'devtools-history';
const MAX_HISTORY_ITEMS = 50;

export function useHistory(toolId: string) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        const allHistory: HistoryItem[] = JSON.parse(saved);
        setHistory(allHistory.filter((item) => item.toolId === toolId));
      } catch {
        setHistory([]);
      }
    }
  }, [toolId]);

  // Add new history item
  const addHistory = useCallback(
    (input: string, output: string, operation: string) => {
      if (!input.trim() || !output.trim()) return;

      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        toolId,
        input,
        output,
        operation,
        timestamp: Date.now(),
      };

      // Get all history
      const saved = localStorage.getItem(HISTORY_KEY);
      let allHistory: HistoryItem[] = [];
      if (saved) {
        try {
          allHistory = JSON.parse(saved);
        } catch {
          allHistory = [];
        }
      }

      // Add new item and limit size
      allHistory = [newItem, ...allHistory].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));

      // Update local state
      setHistory(allHistory.filter((item) => item.toolId === toolId));
    },
    [toolId]
  );

  // Clear history for current tool
  const clearHistory = useCallback(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        const allHistory: HistoryItem[] = JSON.parse(saved);
        const filtered = allHistory.filter((item) => item.toolId !== toolId);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
        setHistory([]);
      } catch {
        localStorage.removeItem(HISTORY_KEY);
        setHistory([]);
      }
    }
  }, [toolId]);

  return { history, addHistory, clearHistory };
}
