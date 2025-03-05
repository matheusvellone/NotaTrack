include ./node_modules/@vellone/techsak/Makefile

.PHONY: app
app: ## Build the app
	@npm run dev

.PHONY: prisma-studio
prisma-studio: ## Start up Prisma Studio
	@npx prisma studio

.PHONY: db-sync
db-sync: ## Synchronize prisma schema with database by generating a new migration
	@npx prisma migrate dev

.PHONY: db-reset
db-reset: ## Reset your database
	@npx prisma migrate reset

.PHONY: types
types: ## Generate types
	@npx prisma generate

.PHONY: knip
knip: ## Run Knip
	@npx knip

.PHONY: build-test
build-test: ## Run TS check and linter
	@npm run build-test
