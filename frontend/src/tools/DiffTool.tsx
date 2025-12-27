import { useState } from 'react';
import '../types/wails.d';
import { useKeyboardShortcuts } from '../hooks';
import { DiffLine, DiffStats } from '../types/wails.d';
import { ToolPanel, ButtonGroup } from '../components';

type ViewMode = 'split' | 'unified';

export function DiffTool() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState<DiffStats | null>(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [comparing, setComparing] = useState(false);

  const handleCompare = async () => {
    try {
      setError('');
      setComparing(true);
      const result = await window.go.tools.ToolService.TextDiff(oldText, newText);
      if (result.error) {
        setError(result.error);
      } else {
        setDiffLines(result.lines);
        setStats(result.stats);
      }
    } catch (e) {
      setError('Comparison failed');
    } finally {
      setComparing(false);
    }
  };

  const handleClear = () => {
    setOldText('');
    setNewText('');
    setDiffLines([]);
    setStats(null);
    setError('');
  };

  const handleSwap = () => {
    const temp = oldText;
    setOldText(newText);
    setNewText(temp);
    setDiffLines([]);
    setStats(null);
  };

  useKeyboardShortcuts([
    { key: 'Enter', metaKey: true, action: handleCompare, description: 'Compare (Cmd+Enter)' },
    { key: 'k', metaKey: true, action: handleClear, description: 'Clear (Cmd+K)' },
    { key: 's', metaKey: true, shiftKey: true, action: handleSwap, description: 'Swap (Cmd+Shift+S)' },
  ]);

  const renderSplitView = () => {
    const oldLines: { num: number; content: string; type: string }[] = [];
    const newLines: { num: number; content: string; type: string }[] = [];

    diffLines.forEach((line) => {
      if (line.type === 'equal') {
        oldLines.push({ num: line.oldLine, content: line.content, type: 'equal' });
        newLines.push({ num: line.newLine, content: line.content, type: 'equal' });
      } else if (line.type === 'delete') {
        oldLines.push({ num: line.oldLine, content: line.content, type: 'delete' });
        newLines.push({ num: 0, content: '', type: 'empty' });
      } else if (line.type === 'insert') {
        oldLines.push({ num: 0, content: '', type: 'empty' });
        newLines.push({ num: line.newLine, content: line.content, type: 'insert' });
      }
    });

    const renderLine = (line: { num: number; content: string; type: string }, index: number) => {
      let bgClass = '';
      let textClass = 'text-gray-800 dark:text-gray-200';

      if (line.type === 'delete') {
        bgClass = 'bg-red-100 dark:bg-red-900/30';
        textClass = 'text-red-800 dark:text-red-300';
      } else if (line.type === 'insert') {
        bgClass = 'bg-green-100 dark:bg-green-900/30';
        textClass = 'text-green-800 dark:text-green-300';
      } else if (line.type === 'empty') {
        bgClass = 'bg-gray-100 dark:bg-gray-800';
      }

      return (
        <div key={index} className={`flex ${bgClass} border-b border-gray-200 dark:border-gray-700`}>
          <span className="w-10 md:w-12 flex-shrink-0 text-right pr-2 text-gray-500 bg-gray-50 dark:bg-gray-800/50 select-none text-xs leading-6">
            {line.num > 0 ? line.num : ''}
          </span>
          <pre className={`flex-1 px-2 text-xs leading-6 overflow-x-auto ${textClass}`}>
            {line.content || ' '}
          </pre>
        </div>
      );
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1 min-h-0">
        <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden min-h-[200px]">
          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
            Original
          </div>
          <div className="flex-1 overflow-auto font-mono">
            {oldLines.map((line, i) => renderLine(line, i))}
          </div>
        </div>
        <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden min-h-[200px]">
          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
            Modified
          </div>
          <div className="flex-1 overflow-auto font-mono">
            {newLines.map((line, i) => renderLine(line, i))}
          </div>
        </div>
      </div>
    );
  };

  const renderUnifiedView = () => {
    return (
      <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden min-h-[200px]">
        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
          Unified View
        </div>
        <div className="overflow-auto font-mono h-full">
          {diffLines.map((line, index) => {
            let bgClass = '';
            let textClass = 'text-gray-800 dark:text-gray-200';
            let prefix = ' ';

            if (line.type === 'delete') {
              bgClass = 'bg-red-100 dark:bg-red-900/30';
              textClass = 'text-red-800 dark:text-red-300';
              prefix = '-';
            } else if (line.type === 'insert') {
              bgClass = 'bg-green-100 dark:bg-green-900/30';
              textClass = 'text-green-800 dark:text-green-300';
              prefix = '+';
            }

            return (
              <div key={index} className={`flex ${bgClass} border-b border-gray-200 dark:border-gray-700`}>
                <span className="w-10 md:w-12 flex-shrink-0 text-right pr-2 text-gray-500 bg-gray-50 dark:bg-gray-800/50 select-none text-xs leading-6">
                  {line.oldLine > 0 ? line.oldLine : ''}
                </span>
                <span className="w-10 md:w-12 flex-shrink-0 text-right pr-2 text-gray-500 bg-gray-50 dark:bg-gray-800/50 select-none text-xs leading-6">
                  {line.newLine > 0 ? line.newLine : ''}
                </span>
                <span className={`w-5 md:w-6 flex-shrink-0 text-center ${textClass} text-xs leading-6`}>
                  {prefix}
                </span>
                <pre className={`flex-1 px-2 text-xs leading-6 overflow-x-auto ${textClass}`}>
                  {line.content || ' '}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <ToolPanel
      title="Text Compare"
      description="Compare differences between two texts, similar to Git Diff"
      shortcut="Cmd+Enter to compare"
      error={error}
    >
      {/* Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</label>
          <textarea
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="Paste original text, code or YAML..."
            className="h-32 md:h-40 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modified</label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Paste modified text, code or YAML..."
            className="h-32 md:h-40 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
        <ButtonGroup>
          <button
            onClick={handleCompare}
            disabled={comparing || (!oldText && !newText)}
            className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {comparing ? 'Comparing...' : 'Compare'}
          </button>
          <button
            onClick={handleSwap}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Swap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          <button
            onClick={handleClear}
            className="px-3 md:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Clear
          </button>
        </ButtonGroup>

        {/* View Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">View:</span>
          <button
            onClick={() => setViewMode('split')}
            className={`px-2 md:px-3 py-1 text-sm rounded ${
              viewMode === 'split'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setViewMode('unified')}
            className={`px-2 md:px-3 py-1 text-sm rounded ${
              viewMode === 'unified'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Unified
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 text-sm">
          <span className="text-green-600 dark:text-green-400">+{stats.additions} additions</span>
          <span className="text-red-600 dark:text-red-400">-{stats.deletions} deletions</span>
          <span className="text-gray-600 dark:text-gray-400">{stats.changes} changes total</span>
        </div>
      )}

      {/* Diff Display Area */}
      {diffLines.length > 0 && (
        <div className="flex-1 min-h-0">
          {viewMode === 'split' ? renderSplitView() : renderUnifiedView()}
        </div>
      )}

      {/* Empty State */}
      {diffLines.length === 0 && !error && (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg min-h-[150px]">
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            <svg className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm md:text-base">Enter two texts above and click "Compare"</p>
          </div>
        </div>
      )}
    </ToolPanel>
  );
}
