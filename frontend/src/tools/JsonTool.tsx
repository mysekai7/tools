import { useState } from 'react';
import '../types/wails.d';
import { useKeyboardShortcuts, useHistory, useCopyFeedback } from '../hooks';

export function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { history, addHistory, clearHistory } = useHistory('json');
  const { copied, copyToClipboard } = useCopyFeedback();
  const [showHistory, setShowHistory] = useState(false);

  const handlePretty = async () => {
    try {
      setError('');
      const result = await window.go.tools.ToolService.JsonPretty(input);
      setOutput(result);
      addHistory(input, result, 'pretty');
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const handleMinify = async () => {
    try {
      setError('');
      const result = await window.go.tools.ToolService.JsonMinify(input);
      setOutput(result);
      addHistory(input, result, 'minify');
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const handleCopy = () => copyToClipboard(output);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setError('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (e) {
      // Clipboard access denied
    }
  };

  const loadFromHistory = (item: typeof history[0]) => {
    setInput(item.input);
    setOutput(item.output);
    setShowHistory(false);
  };

  useKeyboardShortcuts([
    { key: 'p', metaKey: true, shiftKey: true, action: handlePretty, description: 'Pretty (Cmd+Shift+P)' },
    { key: 'm', metaKey: true, shiftKey: true, action: handleMinify, description: 'Minify (Cmd+Shift+M)' },
    { key: 'k', metaKey: true, action: handleClear, description: 'Clear (Cmd+K)' },
    { key: 'c', metaKey: true, shiftKey: true, action: handleCopy, description: 'Copy output (Cmd+Shift+C)' },
  ]);

  return (
    <div className="h-full flex flex-col p-6 bg-white dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">JSON Formatter</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Pretty print or minify JSON
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">Cmd+Shift+P pretty, Cmd+Shift+M minify</span>
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input</label>
              <button
                onClick={handlePaste}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Paste
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePretty}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Pretty
            </button>
            <button
              onClick={handleMinify}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Minify
            </button>
            <button
              onClick={handleSwap}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Use output as input"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Clear (Cmd+K)"
            >
              Clear
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
              {output && (
                <button
                  onClick={handleCopy}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  {copied ? (
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
            <textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
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
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        item.operation === 'pretty'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
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
