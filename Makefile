.PHONY: dev build clean install help frontend-install frontend-build
.PHONY: package

VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)

# Default target
help:
	@echo "DevTools - Makefile Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make install    - Install all dependencies (Go + Frontend)"
	@echo "  make dev        - Run in development mode with hot reload"
	@echo "  make build      - Build production Mac application"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make help       - Show this help message"
	@echo ""

# Install all dependencies
install: frontend-install
	@echo "Installing Go dependencies..."
	go mod tidy
	@echo "Done!"

# Install frontend dependencies
frontend-install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Build frontend only
frontend-build:
	@echo "Building frontend..."
	cd frontend && VITE_APP_VERSION=$(VERSION) npm run build:version

# Run in development mode (fresh frontend build + backend dev using built assets)
dev: frontend-install frontend-build
	@echo "Starting development server (frontend built, backend dev using dist assets, no Vite dev server)..."
	VITE_APP_VERSION=$(VERSION) GOCACHE=$(shell pwd)/.gocache wails dev -m -assetdir $(shell pwd)/frontend/dist -frontenddevserverurl "" -noreload

# Build production application
build:
	@echo "Building production application..."
	wails build
	@echo "Build complete! Application is in build/bin/"

package: frontend-build
	@echo "Building macOS packages for amd64 and arm64..."
	@rm -rf output && mkdir -p output
	@echo "Building darwin/amd64..."
	wails build -platform darwin/amd64
	@cp -R build/bin/DevTools.app output/DevTools-$(VERSION)-darwin-amd64.app
	@cd output && zip -qry DevTools-$(VERSION)-darwin-amd64.zip DevTools-$(VERSION)-darwin-amd64.app
	@rm -rf build/bin
	@echo "Building darwin/arm64..."
	wails build -platform darwin/arm64
	@cp -R build/bin/DevTools.app output/DevTools-$(VERSION)-darwin-arm64.app
	@cd output && zip -qry DevTools-$(VERSION)-darwin-arm64.zip DevTools-$(VERSION)-darwin-arm64.app
	@echo "Packages ready in output/:"
	@ls -1 output/*.zip

# Build for specific platform
build-darwin:
	@echo "Building for macOS..."
	wails build -platform darwin/universal

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf build/bin
	rm -rf frontend/dist
	rm -rf frontend/node_modules/.vite
	@echo "Clean complete!"

# Generate Wails bindings
generate:
	@echo "Generating Wails bindings..."
	wails generate module

# Run Go tests
test:
	@echo "Running tests..."
	go test ./...

# Format code
fmt:
	@echo "Formatting Go code..."
	go fmt ./...
	@echo "Formatting frontend code..."
	cd frontend && npm run format 2>/dev/null || true
