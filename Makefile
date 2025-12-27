.PHONY: dev build clean install help frontend-install frontend-build

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
	cd frontend && npm run build

# Run in development mode
dev:
	@echo "Starting development server..."
	wails dev

# Build production application
build:
	@echo "Building production application..."
	wails build
	@echo "Build complete! Application is in build/bin/"

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
