import { useState, useCallback } from 'react';

export function useCopyFeedback(duration: number = 2000) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      if (!text) return false;

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), duration);
        return true;
      } catch {
        return false;
      }
    },
    [duration]
  );

  return { copied, copyToClipboard };
}
