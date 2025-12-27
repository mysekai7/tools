import { useState } from 'react';
import '../types/wails.d';
import { useKeyboardShortcuts, useHistory, useCopyFeedback } from '../hooks';

type HashType = 'md5' | 'sha1' | 'sha256';

export function HashTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<HashType, string>>({
    md5: '',
    sha1: '',
    sha256: '',
  });
  const [selectedHash, setSelectedHash] = useState<HashType | 'all'>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const { history, addHistory, clearHistory } = useHistory('hash');
  const [showHistory, setShowHistory] = useState(false);

  const hashAll = async () => {
    if (!input) return;

    const [md5, sha1, sha256] = await Promise.all([
      window.go.tools.ToolService.MD5Hash(input),
      window.go.tools.ToolService.SHA1Hash(input),
      window.go.tools.ToolService.SHA256Hash(input),
    ]);

    setResults({ md5, sha1, sha256 });
    addHistory(input, `MD5: ${md5}`, 'all');
  };

  const handleHash = async () => {
    if (!input) return;

    if (selectedHash === 'all') {
      await hashAll();
    } else {
      let result = '';
      switch (selectedHash) {
        case 'md5':
          result = await window.go.tools.ToolService.MD5Hash(input);
          break;
        case 'sha1':
          result = await window.go.tools.ToolService.SHA1Hash(input);
          break;
        case 'sha256':
          result = await window.go.tools.ToolService.SHA256Hash(input);
          break;
      }
      setResults(prev => ({ ...prev, [selectedHash]: result }));
      addHistory(input, result, selectedHash);
    }
  };

  const handleCopy = async (hash: string, type: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleClear = () => {
    setInput('');
    setResults({ md5: '', sha1: '', sha256: '' });
  };

  const loadFromHistory = (item: typeof history[0]) => {
    setInput(item.input);
    setShowHistory(false);
  };

  useKeyboardShortcuts([
    { key: 'Enter', metaKey: true, action: handleHash, description: 'Generate hash (Cmd+Enter)' },
    { key: 'k', metaKey: true, action: handleClear, description: 'Clear (Cmd+K)' },
  ]);

  const hashTypes: { key: HashType; label: string; length: number }[] = [
    { key: 'md5', label: 'MD5', length: 32 },
    { key: 'sha1', label: 'SHA1', length: 40 },
    { key: 'sha256', label: 'SHA256', length: 64 },
  ];

  return (
    <div className="h-full flex flex-col p-6 bg-white dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Hash Generator</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Generate MD5, SHA1, SHA256 hashes
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">Cmd+Enter to generate</span>
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            showHistory
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          History ({history.length})
        </button>
      </div>

      <div className="flex-1 flex gap-4">
        <div className={`flex-1 flex flex-col gap-4 ${showHistory ? 'w-2/3' : 'w-full'}`}>
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedHash}
              onChange={(e) => setSelectedHash(e.target.value as HashType | 'all')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Hashes</option>
              <option value="md5">MD5 only</option>
              <option value="sha1">SHA1 only</option>
              <option value="sha256">SHA256 only</option>
            </select>
            <button
              onClick={handleHash}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Hash
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Clear (Cmd+K)"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-auto">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Results</label>

            {hashTypes.map(({ key, label, length }) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {label} <span className="text-gray-400 dark:text-gray-500">({length} chars)</span>
                  </span>
                  {results[key] && (
                    <button
                      onClick={() => handleCopy(results[key], key)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      {copiedHash === key ? (
                        <>
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="font-mono text-sm break-all text-gray-800 dark:text-gray-200 min-h-[24px]">
                  {results[key] || <span className="text-gray-400 dark:text-gray-500">-</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showHistory && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 pl-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 dark:text-white">History</h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {history.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No history yet</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        {item.operation}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.input}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
