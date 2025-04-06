include ./node_modules/@vellone/techsak/Makefile

include .env
export

DOCKER_COMPOSE = docker compose

.PHONY: setup
setup: ## Setup local environment for development
	@$(DOCKER_COMPOSE) up -d --wait postgres
	@npx drizzle-kit migrate

.PHONY: app
app: ## Build the app
	@npm run dev

.PHONY: db-studio
db-studio: ## Start up Drizzle Studio
	@npx drizzle-kit studio

.PHONY: db-sync
db-sync: ## Synchronize Drizzle schema with database by generating a new migration
	@npx drizzle-kit generate

.PHONY: db-reset
db-reset: ## Reset your database
	@$(DOCKER_COMPOSE) down --volumes
	@make setup

.PHONY: knip
knip: ## Run Knip
	@npx knip

.PHONY: build-test
build-test: ## Run TS check and linter
	@npm run build-test
