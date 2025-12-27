import { useState } from 'react';
import '../types/wails.d';
import { useKeyboardShortcuts, useHistory, useCopyFeedback } from '../hooks';
import { JWTDecodeResult } from '../types/wails.d';

export function JwtTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<JWTDecodeResult | null>(null);
  const [error, setError] = useState('');
  const { history, addHistory, clearHistory } = useHistory('jwt');
  const [showHistory, setShowHistory] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleDecode = async () => {
    try {
      setError('');
      const decoded = await window.go.tools.ToolService.JWTDecode(input);
      if (decoded.error) {
        setError(decoded.error);
        setResult(null);
      } else {
        setResult(decoded);
        addHistory(input, decoded.header, 'decode');
      }
    } catch (e) {
      setError('Failed to decode JWT');
      setResult(null);
    }
  };

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
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
    setShowHistory(false);
  };

  useKeyboardShortcuts([
    { key: 'Enter', metaKey: true, action: handleDecode, description: 'Decode JWT (Cmd+Enter)' },
    { key: 'k', metaKey: true, action: handleClear, description: 'Clear (Cmd+K)' },
  ]);

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <button
      onClick={() => handleCopy(text, section)}
      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
    >
      {copiedSection === section ? (
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
    <div className="h-full flex flex-col p-6 bg-white dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">JWT Decoder</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Decode and inspect JWT tokens
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">Cmd+Enter to decode</span>
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

      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className={`flex-1 flex flex-col gap-4 overflow-hidden ${showHistory ? 'w-2/3' : 'w-full'}`}>
          {/* Input */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JWT Token</label>
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
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              className="w-full h-24 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDecode}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Decode
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

          {/* Results */}
          {result && (
            <div className="flex-1 overflow-auto space-y-4">
              {/* Header */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded text-xs">HEADER</span>
                    Algorithm & Token Type
                  </span>
                  <CopyButton text={result.header} section="header" />
                </div>
                <pre className="font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto">
                  {result.header}
                </pre>
              </div>

              {/* Payload */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded text-xs">PAYLOAD</span>
                    Claims Data
                  </span>
                  <CopyButton text={result.payload} section="payload" />
                </div>
                <pre className="font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto">
                  {result.payload}
                </pre>
              </div>

              {/* Signature */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-xs">SIGNATURE</span>
                    Verification
                  </span>
                  <CopyButton text={result.signature} section="signature" />
                </div>
                <p className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                  {result.signature}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Note: Signature verification requires the secret key, which is not available client-side.
                </p>
              </div>

              {/* Status */}
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                result.isValid
                  ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700'
              }`}>
                {result.isValid ? (
                  <>
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 dark:text-green-300 text-sm">Token structure is valid</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-yellow-700 dark:text-yellow-300 text-sm">Token structure is invalid</span>
                  </>
                )}
              </div>
            </div>
          )}
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
                      <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                        jwt
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.input.substring(0, 30)}...</p>
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
