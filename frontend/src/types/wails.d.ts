export interface JWTDecodeResult {
  header: string;
  payload: string;
  signature: string;
  isValid: boolean;
  error: string;
}

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
  error: string;
}

export interface RSAEncryptResult {
  ciphertext: string;
  error: string;
}

export interface RSADecryptResult {
  plaintext: string;
  error: string;
}

export interface DiffLine {
  type: 'equal' | 'insert' | 'delete';
  content: string;
  oldLine: number;
  newLine: number;
}

export interface DiffStats {
  additions: number;
  deletions: number;
  changes: number;
}

export interface DiffResult {
  lines: DiffLine[];
  stats: DiffStats;
  error: string;
}

export interface ToolServiceAPI {
  Base64Encode: (input: string) => Promise<string>;
  Base64Decode: (input: string) => Promise<string>;
  UrlEncode: (input: string) => Promise<string>;
  UrlDecode: (input: string) => Promise<string>;
  MD5Hash: (input: string) => Promise<string>;
  SHA1Hash: (input: string) => Promise<string>;
  SHA256Hash: (input: string) => Promise<string>;
  JsonPretty: (input: string) => Promise<string>;
  JsonMinify: (input: string) => Promise<string>;
  JWTDecode: (token: string) => Promise<JWTDecodeResult>;
  YamlPretty: (input: string) => Promise<string>;
  YamlToJson: (input: string) => Promise<string>;
  JsonToYaml: (input: string) => Promise<string>;
  RSAGenerateKeyPair: (bits: number) => Promise<RSAKeyPair>;
  RSAEncrypt: (publicKey: string, plaintext: string) => Promise<RSAEncryptResult>;
  RSADecrypt: (privateKey: string, ciphertext: string) => Promise<RSADecryptResult>;
  TextDiff: (oldText: string, newText: string) => Promise<DiffResult>;
}

declare global {
  interface Window {
    go: {
      tools: {
        ToolService: ToolServiceAPI;
      };
    };
  }
}

export {};
