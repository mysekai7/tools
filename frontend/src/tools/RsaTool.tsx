import { useState } from 'react';
import '../types/wails.d';
import { useKeyboardShortcuts, useCopyFeedback } from '../hooks';

type KeySize = 512 | 1024 | 2048 | 4096;

export function RsaTool() {
  const [keySize, setKeySize] = useState<KeySize>(2048);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerateKeys = async () => {
    try {
      setError('');
      setGenerating(true);
      const result = await window.go.tools.ToolService.RSAGenerateKeyPair(keySize);
      if (result.error) {
        setError(result.error);
      } else {
        setPublicKey(result.publicKey);
        setPrivateKey(result.privateKey);
      }
    } catch (e) {
      setError('Failed to generate key pair');
    } finally {
      setGenerating(false);
    }
  };

  const handleEncrypt = async () => {
    if (!publicKey || !plaintext) {
      setError('Public key and plaintext are required');
      return;
    }
    try {
      setError('');
      const result = await window.go.tools.ToolService.RSAEncrypt(publicKey, plaintext);
      if (result.error) {
        setError(result.error);
      } else {
        setCiphertext(result.ciphertext);
      }
    } catch (e) {
      setError('Encryption failed');
    }
  };

  const handleDecrypt = async () => {
    if (!privateKey || !ciphertext) {
      setError('Private key and ciphertext are required');
      return;
    }
    try {
      setError('');
      const result = await window.go.tools.ToolService.RSADecrypt(privateKey, ciphertext);
      if (result.error) {
        setError(result.error);
      } else {
        setPlaintext(result.plaintext);
      }
    } catch (e) {
      setError('Decryption failed');
    }
  };

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleClear = () => {
    setPublicKey('');
    setPrivateKey('');
    setPlaintext('');
    setCiphertext('');
    setError('');
  };

  useKeyboardShortcuts([
    { key: 'g', metaKey: true, shiftKey: true, action: handleGenerateKeys, description: 'Generate keys (Cmd+Shift+G)' },
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
    <div className="h-full flex flex-col p-6 bg-white dark:bg-gray-900 overflow-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">RSA Encryption</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Generate RSA keys and encrypt/decrypt data
          <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">Cmd+Shift+G generate keys</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Key Generation */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Key Generation</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Key Size:</label>
            <select
              value={keySize}
              onChange={(e) => setKeySize(Number(e.target.value) as KeySize)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value={512}>512 bit</option>
              <option value={1024}>1024 bit</option>
              <option value={2048}>2048 bit (Recommended)</option>
              <option value={4096}>4096 bit</option>
            </select>
          </div>
          <button
            onClick={handleGenerateKeys}
            disabled={generating}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate Key Pair'}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Public Key */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Public Key</label>
            {publicKey && <CopyButton text={publicKey} section="publicKey" />}
          </div>
          <textarea
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="-----BEGIN PUBLIC KEY-----&#10;...&#10;-----END PUBLIC KEY-----"
            className="h-40 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Private Key */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Private Key</label>
            {privateKey && <CopyButton text={privateKey} section="privateKey" />}
          </div>
          <textarea
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
            className="h-40 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Encryption/Decryption */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Plaintext */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plaintext</label>
            {plaintext && <CopyButton text={plaintext} section="plaintext" />}
          </div>
          <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Enter text to encrypt..."
            className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[120px]"
          />
          <button
            onClick={handleEncrypt}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Encrypt →
          </button>
        </div>

        {/* Ciphertext */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ciphertext (Base64)</label>
            {ciphertext && <CopyButton text={ciphertext} section="ciphertext" />}
          </div>
          <textarea
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            placeholder="Encrypted data will appear here..."
            className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[120px]"
          />
          <button
            onClick={handleDecrypt}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            ← Decrypt
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> RSA encryption uses OAEP padding with SHA-256. Maximum plaintext size depends on key size:
          512-bit ≈ 22 bytes, 1024-bit ≈ 86 bytes, 2048-bit ≈ 190 bytes, 4096-bit ≈ 446 bytes.
        </p>
      </div>
    </div>
  );
}
