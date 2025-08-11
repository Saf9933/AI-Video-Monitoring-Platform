.PHONY: help dev build test lint clean install docker-build docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies for all services
	npm install
	cd frontend && npm install
	cd services/mock-api && npm install

dev: ## Start development servers
	docker-compose up --build

api-dev: ## Start only the mock API in development mode
	cd services/mock-api && npm run dev

frontend-dev: ## Start only the frontend in development mode
	cd frontend && npm run dev

build: ## Build all services
	cd services/mock-api && npm run build
	cd frontend && npm run build

test: ## Run tests for all services
	cd services/mock-api && npm test
	cd frontend && npm test

api-test: ## Run tests for mock API only
	cd services/mock-api && npm test

lint: ## Lint all services
	cd services/mock-api && npm run lint
	cd frontend && npm run lint

lint-fix: ## Fix linting issues
	cd services/mock-api && npm run lint:fix
	cd frontend && npm run lint:fix

docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start services with Docker Compose
	docker-compose up -d

docker-down: ## Stop services with Docker Compose
	docker-compose down

docker-logs: ## View logs from all services
	docker-compose logs -f

clean: ## Clean build artifacts and dependencies
	rm -rf node_modules
	rm -rf frontend/node_modules
	rm -rf services/mock-api/node_modules
	rm -rf services/mock-api/dist
	rm -rf frontend/dist