package tools

import (
	"crypto/md5"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha1"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"net/url"
	"strings"

	"github.com/sergi/go-diff/diffmatchpatch"
	"gopkg.in/yaml.v3"
)

// ToolService provides various encoding/decoding utilities
type ToolService struct{}

// NewToolService creates a new ToolService instance
func NewToolService() *ToolService {
	return &ToolService{}
}

// Base64Encode encodes the input string to base64
func (t *ToolService) Base64Encode(input string) string {
	return base64.StdEncoding.EncodeToString([]byte(input))
}

// Base64Decode decodes a base64 encoded string
func (t *ToolService) Base64Decode(input string) (string, error) {
	decoded, err := base64.StdEncoding.DecodeString(input)
	if err != nil {
		return "", err
	}
	return string(decoded), nil
}

// UrlEncode encodes the input string for URL
func (t *ToolService) UrlEncode(input string) string {
	return url.QueryEscape(input)
}

// UrlDecode decodes a URL encoded string
func (t *ToolService) UrlDecode(input string) (string, error) {
	return url.QueryUnescape(input)
}

// MD5Hash returns the MD5 hash of the input string
func (t *ToolService) MD5Hash(input string) string {
	hash := md5.Sum([]byte(input))
	return hex.EncodeToString(hash[:])
}

// SHA1Hash returns the SHA1 hash of the input string
func (t *ToolService) SHA1Hash(input string) string {
	hash := sha1.Sum([]byte(input))
	return hex.EncodeToString(hash[:])
}

// SHA256Hash returns the SHA256 hash of the input string
func (t *ToolService) SHA256Hash(input string) string {
	hash := sha256.Sum256([]byte(input))
	return hex.EncodeToString(hash[:])
}

// JsonPretty formats JSON with indentation
func (t *ToolService) JsonPretty(input string) (string, error) {
	var data interface{}
	if err := json.Unmarshal([]byte(input), &data); err != nil {
		return "", err
	}
	pretty, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return "", err
	}
	return string(pretty), nil
}

// JsonMinify removes whitespace from JSON
func (t *ToolService) JsonMinify(input string) (string, error) {
	var data interface{}
	if err := json.Unmarshal([]byte(input), &data); err != nil {
		return "", err
	}
	minified, err := json.Marshal(data)
	if err != nil {
		return "", err
	}
	return string(minified), nil
}

// JWTDecodeResult represents the decoded JWT token
type JWTDecodeResult struct {
	Header    string `json:"header"`
	Payload   string `json:"payload"`
	Signature string `json:"signature"`
	IsValid   bool   `json:"isValid"`
	Error     string `json:"error"`
}

// JWTDecode decodes a JWT token and returns its parts
func (t *ToolService) JWTDecode(token string) JWTDecodeResult {
	result := JWTDecodeResult{}

	// Trim whitespace
	token = strings.TrimSpace(token)

	// Split the token
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		result.Error = "Invalid JWT format: expected 3 parts separated by dots"
		return result
	}

	// Decode header
	headerBytes, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		result.Error = fmt.Sprintf("Failed to decode header: %v", err)
		return result
	}

	// Pretty print header
	var headerJSON interface{}
	if err := json.Unmarshal(headerBytes, &headerJSON); err != nil {
		result.Error = fmt.Sprintf("Failed to parse header JSON: %v", err)
		return result
	}
	headerPretty, _ := json.MarshalIndent(headerJSON, "", "  ")
	result.Header = string(headerPretty)

	// Decode payload
	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		result.Error = fmt.Sprintf("Failed to decode payload: %v", err)
		return result
	}

	// Pretty print payload
	var payloadJSON interface{}
	if err := json.Unmarshal(payloadBytes, &payloadJSON); err != nil {
		result.Error = fmt.Sprintf("Failed to parse payload JSON: %v", err)
		return result
	}
	payloadPretty, _ := json.MarshalIndent(payloadJSON, "", "  ")
	result.Payload = string(payloadPretty)

	// Signature (keep as base64)
	result.Signature = parts[2]

	// Mark as structurally valid (we can't verify signature without the secret)
	result.IsValid = true

	return result
}

// YamlPretty formats YAML with proper indentation
func (t *ToolService) YamlPretty(input string) (string, error) {
	var data interface{}
	if err := yaml.Unmarshal([]byte(input), &data); err != nil {
		return "", fmt.Errorf("invalid YAML: %v", err)
	}

	output, err := yaml.Marshal(data)
	if err != nil {
		return "", err
	}
	return string(output), nil
}

// YamlToJson converts YAML to JSON
func (t *ToolService) YamlToJson(input string) (string, error) {
	var data interface{}
	if err := yaml.Unmarshal([]byte(input), &data); err != nil {
		return "", fmt.Errorf("invalid YAML: %v", err)
	}

	// Convert to JSON with indentation
	jsonBytes, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return "", err
	}
	return string(jsonBytes), nil
}

// JsonToYaml converts JSON to YAML
func (t *ToolService) JsonToYaml(input string) (string, error) {
	var data any
	if err := json.Unmarshal([]byte(input), &data); err != nil {
		return "", fmt.Errorf("invalid JSON: %v", err)
	}

	yamlBytes, err := yaml.Marshal(data)
	if err != nil {
		return "", err
	}
	return string(yamlBytes), nil
}

// RSAKeyPair represents a generated RSA key pair
type RSAKeyPair struct {
	PublicKey  string `json:"publicKey"`
	PrivateKey string `json:"privateKey"`
	Error      string `json:"error"`
}

// RSAGenerateKeyPair generates a new RSA key pair with the specified bit size
func (t *ToolService) RSAGenerateKeyPair(bits int) RSAKeyPair {
	result := RSAKeyPair{}

	// Validate bit size
	if bits != 512 && bits != 1024 && bits != 2048 && bits != 4096 {
		result.Error = "Invalid key size. Must be 512, 1024, 2048, or 4096"
		return result
	}

	// Generate private key
	privateKey, err := rsa.GenerateKey(rand.Reader, bits)
	if err != nil {
		result.Error = fmt.Sprintf("Failed to generate key: %v", err)
		return result
	}

	// Encode private key to PEM
	privateKeyBytes := x509.MarshalPKCS1PrivateKey(privateKey)
	privateKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: privateKeyBytes,
	})
	result.PrivateKey = string(privateKeyPEM)

	// Encode public key to PEM
	publicKeyBytes, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		result.Error = fmt.Sprintf("Failed to marshal public key: %v", err)
		return result
	}
	publicKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: publicKeyBytes,
	})
	result.PublicKey = string(publicKeyPEM)

	return result
}

// RSAEncryptResult represents the result of RSA encryption
type RSAEncryptResult struct {
	Ciphertext string `json:"ciphertext"`
	Error      string `json:"error"`
}

// RSAEncrypt encrypts plaintext using RSA public key
func (t *ToolService) RSAEncrypt(publicKeyPEM string, plaintext string) RSAEncryptResult {
	result := RSAEncryptResult{}

	// Parse public key
	block, _ := pem.Decode([]byte(publicKeyPEM))
	if block == nil {
		result.Error = "Failed to parse PEM block containing the public key"
		return result
	}

	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		result.Error = fmt.Sprintf("Failed to parse public key: %v", err)
		return result
	}

	rsaPub, ok := pub.(*rsa.PublicKey)
	if !ok {
		result.Error = "Not an RSA public key"
		return result
	}

	// Encrypt using OAEP with SHA-256
	ciphertext, err := rsa.EncryptOAEP(sha256.New(), rand.Reader, rsaPub, []byte(plaintext), nil)
	if err != nil {
		result.Error = fmt.Sprintf("Encryption failed: %v", err)
		return result
	}

	// Encode to base64
	result.Ciphertext = base64.StdEncoding.EncodeToString(ciphertext)
	return result
}

// RSADecryptResult represents the result of RSA decryption
type RSADecryptResult struct {
	Plaintext string `json:"plaintext"`
	Error     string `json:"error"`
}

// RSADecrypt decrypts ciphertext using RSA private key
func (t *ToolService) RSADecrypt(privateKeyPEM string, ciphertextBase64 string) RSADecryptResult {
	result := RSADecryptResult{}

	// Parse private key
	block, _ := pem.Decode([]byte(privateKeyPEM))
	if block == nil {
		result.Error = "Failed to parse PEM block containing the private key"
		return result
	}

	privateKey, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		result.Error = fmt.Sprintf("Failed to parse private key: %v", err)
		return result
	}

	// Decode base64 ciphertext
	ciphertext, err := base64.StdEncoding.DecodeString(ciphertextBase64)
	if err != nil {
		result.Error = fmt.Sprintf("Failed to decode ciphertext: %v", err)
		return result
	}

	// Decrypt using OAEP with SHA-256
	plaintext, err := rsa.DecryptOAEP(sha256.New(), rand.Reader, privateKey, ciphertext, nil)
	if err != nil {
		result.Error = fmt.Sprintf("Decryption failed: %v", err)
		return result
	}

	result.Plaintext = string(plaintext)
	return result
}

// DiffLine represents a single line in the diff output
type DiffLine struct {
	Type    string `json:"type"`    // "equal", "insert", "delete"
	Content string `json:"content"` // Line content
	OldLine int    `json:"oldLine"` // Line number in old text (0 if insert)
	NewLine int    `json:"newLine"` // Line number in new text (0 if delete)
}

// DiffResult represents the result of a diff operation
type DiffResult struct {
	Lines      []DiffLine `json:"lines"`
	Stats      DiffStats  `json:"stats"`
	Error      string     `json:"error"`
}

// DiffStats contains statistics about the diff
type DiffStats struct {
	Additions int `json:"additions"`
	Deletions int `json:"deletions"`
	Changes   int `json:"changes"`
}

// TextDiff compares two texts and returns the differences
func (t *ToolService) TextDiff(oldText, newText string) DiffResult {
	result := DiffResult{
		Lines: []DiffLine{},
	}

	dmp := diffmatchpatch.New()

	// Split texts into lines
	oldLines := strings.Split(oldText, "\n")
	newLines := strings.Split(newText, "\n")

	// Convert lines to runes for diff algorithm
	chars1, chars2, lineArray := dmp.DiffLinesToChars(oldText, newText)

	// Compute diff
	diffs := dmp.DiffMain(chars1, chars2, false)

	// Convert back to lines
	diffs = dmp.DiffCharsToLines(diffs, lineArray)

	// Process diffs into our format
	oldLineNum := 1
	newLineNum := 1

	for _, diff := range diffs {
		lines := strings.Split(diff.Text, "\n")
		// Remove last empty element if text ends with newline
		if len(lines) > 0 && lines[len(lines)-1] == "" {
			lines = lines[:len(lines)-1]
		}

		for _, line := range lines {
			switch diff.Type {
			case diffmatchpatch.DiffEqual:
				result.Lines = append(result.Lines, DiffLine{
					Type:    "equal",
					Content: line,
					OldLine: oldLineNum,
					NewLine: newLineNum,
				})
				oldLineNum++
				newLineNum++
			case diffmatchpatch.DiffDelete:
				result.Lines = append(result.Lines, DiffLine{
					Type:    "delete",
					Content: line,
					OldLine: oldLineNum,
					NewLine: 0,
				})
				oldLineNum++
				result.Stats.Deletions++
			case diffmatchpatch.DiffInsert:
				result.Lines = append(result.Lines, DiffLine{
					Type:    "insert",
					Content: line,
					OldLine: 0,
					NewLine: newLineNum,
				})
				newLineNum++
				result.Stats.Additions++
			}
		}
	}

	result.Stats.Changes = result.Stats.Additions + result.Stats.Deletions

	// Handle empty input edge case
	if len(oldLines) == 1 && oldLines[0] == "" && len(newLines) == 1 && newLines[0] == "" {
		result.Lines = []DiffLine{}
	}

	return result
}
