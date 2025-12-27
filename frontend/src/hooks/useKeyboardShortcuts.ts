import { useEffect, useCallback } from 'react';

type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Allow Cmd+Enter in textareas
        if (!(event.metaKey && event.key === 'Enter')) {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Common shortcuts helper
export const createToolShortcuts = (actions: {
  onEncode?: () => void;
  onDecode?: () => void;
  onClear?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onSwap?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.onEncode) {
    shortcuts.push({
      key: 'e',
      metaKey: true,
      action: actions.onEncode,
      description: 'Encode (Cmd+E)',
    });
  }

  if (actions.onDecode) {
    shortcuts.push({
      key: 'd',
      metaKey: true,
      action: actions.onDecode,
      description: 'Decode (Cmd+D)',
    });
  }

  if (actions.onClear) {
    shortcuts.push({
      key: 'k',
      metaKey: true,
      action: actions.onClear,
      description: 'Clear (Cmd+K)',
    });
  }

  if (actions.onCopy) {
    shortcuts.push({
      key: 'c',
      metaKey: true,
      shiftKey: true,
      action: actions.onCopy,
      description: 'Copy output (Cmd+Shift+C)',
    });
  }

  if (actions.onSwap) {
    shortcuts.push({
      key: 's',
      metaKey: true,
      shiftKey: true,
      action: actions.onSwap,
      description: 'Swap (Cmd+Shift+S)',
    });
  }

  return shortcuts;
};
