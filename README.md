# DevTools

A Mac desktop utility application built with Wails (Go + React + TypeScript).

## Features

### Implemented (Milestone 1, 2 & 3)

- [x] **Base64 Encode/Decode** - Convert text to/from Base64 encoding
- [x] **URL Encode/Decode** - Encode/decode URL strings
- [x] **JWT Decoder** - Decode JWT tokens, view header/payload/signature
- [x] **Hash Generator** - Generate MD5, SHA1, SHA256 hashes
- [x] **JSON Formatter** - Pretty print and minify JSON
- [x] **YAML Tools** - Format YAML, convert between YAML and JSON
- [x] **RSA Encryption** - Generate key pairs, encrypt/decrypt with RSA
- [x] **Diff Compare** - Compare two texts and show differences like Git diff
- [x] **Responsive Layout** - Collapsible sidebar, mobile overlay, adaptive panels
- [x] **Keyboard Shortcuts** - Quick actions with Cmd+key combinations
- [x] **History Records** - View and restore previous operations
- [x] **Dark/Light Theme** - Toggle between themes with persistence
- [x] **Copy Feedback** - Visual confirmation when copying to clipboard

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+E` | Encode (Base64/URL) |
| `Cmd+D` | Decode (Base64/URL) |
| `Cmd+K` | Clear input/output |
| `Cmd+Shift+C` | Copy output |
| `Cmd+Shift+S` | Swap input/output |
| `Cmd+Shift+P` | Pretty JSON |
| `Cmd+Shift+M` | Minify JSON |
| `Cmd+Shift+Y` | Pretty YAML |
| `Cmd+Shift+J` | YAML to JSON |
| `Cmd+Shift+G` | Generate RSA keys |
| `Cmd+Enter` | Generate Hash / Decode JWT |

### Future (Milestone 4+)

- [ ] Tool search/filter
- [ ] Import/Export settings
- [ ] More encoding tools (Base32, Hex, etc.)

## Tech Stack

- **Backend**: Go 1.23 + Wails v2
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS v4 + Radix UI primitives + custom components

## Project Structure

```
tools/
├── main.go                      # Application entry point
├── app.go                       # App struct and methods
├── internal/
│   └── tools/
│       └── tools.go             # Tool implementations (Base64, URL, Hash, JSON)
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main React component
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Layout.tsx       # Main layout wrapper
│   │   │   └── Sidebar.tsx      # Left navigation sidebar
│   │   ├── tools/               # Tool-specific components
│   │   │   ├── Base64Tool.tsx   # Base64 encode/decode UI
│   │   │   └── RsaTool.tsx      # RSA encryption/decryption UI
│   │   └── types/               # TypeScript type definitions
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── package.json             # Frontend dependencies
├── wails.json                   # Wails project configuration
├── Makefile                     # Build commands
└── README.md                    # This file
```

## Prerequisites

- Go 1.23+
- Node.js 18+
- Wails CLI v2 (`go install github.com/wailsapp/wails/v2/cmd/wails@latest`)

## Quick Start

```bash
# Install dependencies (Go modules + frontend npm)
make install

# Run in development mode (builds frontend, then starts Wails dev on built assets)
make dev

# Build for production
make build
```

## Development

### Run Development Server

```bash
make dev
```

What happens:
- Installs frontend dependencies if needed.
- Builds the frontend once (`npm run build` → `frontend/dist`).
- Starts Wails dev serving `frontend/dist` (no Vite dev server proxy).

Tips:
- After changing frontend code, rerun `make dev` (or `make frontend-build`) to refresh `dist`.
- Wails dev server runs at http://localhost:34115 using the built assets.

### Build Application

```bash
# Build Mac application
make build

# Clean build artifacts
make clean
```

### Package for distribution

```bash
# Build amd64 + arm64 and zip to output/ with git tag/commit in filename
make package
```

`make package` derives `VERSION` from `git describe --tags --always --dirty` (fallback `dev`) and produces:
- `output/DevTools-<version>-darwin-amd64.zip`
- `output/DevTools-<version>-darwin-arm64.zip`

## Adding New Tools

1. Add Go method in `internal/tools/tools.go`
2. Create React component in `frontend/src/tools/`
3. Register tool in `frontend/src/App.tsx`

Example:
```go
// internal/tools/tools.go
func (t *ToolService) MyNewTool(input string) string {
    // implementation
}
```

```tsx
// frontend/src/tools/MyNewTool.tsx
export function MyNewTool() {
    // React component
}
```

## License

MIT
