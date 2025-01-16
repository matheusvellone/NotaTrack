-- CreateTable
CREATE TABLE "stores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "notas_fiscais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chave_acesso" TEXT NOT NULL,
    "emitted_at" DATETIME NOT NULL,
    "processed_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "nota_fiscal_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nota_fiscal_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "nota_fiscal_products_nota_fiscal_id_fkey" FOREIGN KEY ("nota_fiscal_id") REFERENCES "notas_fiscais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "nota_fiscal_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "store_products" (
    "store_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,

    PRIMARY KEY ("store_id", "code"),
    CONSTRAINT "store_products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "store_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_cnpj_key" ON "stores"("cnpj");
