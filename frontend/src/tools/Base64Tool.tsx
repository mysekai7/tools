import { useState } from 'react';
import '../types/wails.d';
import { useKeyboardShortcuts, createToolShortcuts, useHistory, useCopyFeedback } from '../hooks';
import { ToolPanel, ResponsiveGrid, TextAreaPanel, ButtonGroup } from '../components';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { history, addHistory, clearHistory } = useHistory('base64');
  const { copied, copyToClipboard } = useCopyFeedback();
  const [showHistory, setShowHistory] = useState(false);

  const handleEncode = async () => {
    try {
      setError('');
      const result = await window.go.tools.ToolService.Base64Encode(input);
      setOutput(result);
      addHistory(input, result, 'encode');
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDecode = async () => {
    try {
      setError('');
      const result = await window.go.tools.ToolService.Base64Decode(input);
      setOutput(result);
      addHistory(input, result, 'decode');
    } catch (e) {
      setError('Invalid Base64 string');
    }
  };

  const handleCopy = () => copyToClipboard(output);
  const handleClear = () => { setInput(''); setOutput(''); setError(''); };
  const handleSwap = () => { setInput(output); setOutput(''); setError(''); };

  const loadFromHistory = (item: typeof history[0]) => {
    setInput(item.input);
    setOutput(item.output);
    setShowHistory(false);
  };

  useKeyboardShortcuts(
    createToolShortcuts({
      onEncode: handleEncode,
      onDecode: handleDecode,
      onClear: handleClear,
      onCopy: handleCopy,
      onSwap: handleSwap,
    })
  );

  const CopyButton = () => (
    <button
      onClick={handleCopy}
      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1"
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
  );

  return (
    <ToolPanel
      title="Base64 Encode/Decode"
      description="Encode or decode Base64 strings"
      shortcut="Cmd+E encode, Cmd+D decode"
      error={error}
      actions={
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            showHistory
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          History ({history.length})
        </button>
      }
    >
      <div className="flex-1 flex gap-4 min-h-0">
        <div className={`flex-1 flex flex-col gap-4 ${showHistory ? 'lg:w-2/3' : 'w-full'}`}>
          <ResponsiveGrid className="flex-1">
            <TextAreaPanel
              label="Input"
              value={input}
              onChange={setInput}
              placeholder="Enter text to encode or Base64 string to decode..."
            />
            <TextAreaPanel
              label="Output"
              value={output}
              readOnly
              placeholder="Result will appear here..."
              actions={output ? <CopyButton /> : undefined}
            />
          </ResponsiveGrid>

          <ButtonGroup>
            <button onClick={handleEncode} className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base">
              Encode
            </button>
            <button onClick={handleDecode} className="px-4 md:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base">
              Decode
            </button>
            <button onClick={handleSwap} className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600" title="Swap">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
            <button onClick={handleClear} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm md:text-base">
              Clear
            </button>
          </ButtonGroup>
        </div>

        {showHistory && (
          <div className="hidden lg:flex w-72 border-l border-gray-200 dark:border-gray-700 pl-4 flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 dark:text-white">History</h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-red-600 hover:text-red-800">Clear all</button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No history yet</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        item.operation === 'encode' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>{item.operation}</span>
                      <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.input}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </ToolPanel>
  );
}
