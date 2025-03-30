import { integer, numeric, pgEnum, pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core'
import { cnpj, id, nfeAccessKey } from './customTypes'
import { relations, sql } from 'drizzle-orm'
import { getEnumValues } from '~/helpers/enum'

export type ModelName = 'Store' | 'Invoice' | 'Product' | 'InvoiceProduct' | 'StoreProduct'
export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus]
export type ProductUnit = typeof ProductUnit[keyof typeof ProductUnit]
export type Store = typeof storeTable.$inferSelect
export type Invoice = typeof invoiceTable.$inferSelect
export type Product = typeof productTable.$inferSelect
export type InvoiceProduct = typeof invoiceProductTable.$inferSelect
export type StoreProduct = typeof storeProductTable.$inferSelect

const timestamps = {
  createdAt: timestamp({ withTimezone: true, mode: 'string' })
    .default(sql`(now() AT TIME ZONE 'UTC'::TEXT)`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' })
    .$onUpdate(() => sql`(now() AT TIME ZONE 'UTC'::TEXT)`),
}

export const storeTable = pgTable('stores', {
  id: id<'Store'>(),
  name: varchar({ length: 255 }).notNull(),
  cnpj: cnpj().notNull().unique(),
  ...timestamps,
})

export const storeRelations = relations(storeTable, ({ many }) => ({
  invoices: many(invoiceTable),
  storeProducts: many(storeProductTable),
}))

export const InvoiceStatus = {
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  ERROR: 'ERROR',
} as const

export const invoiceStatusEnum = pgEnum('invoice_status', getEnumValues(InvoiceStatus))

export const invoiceTable = pgTable('invoices', {
  id: id<'Invoice'>(),
  accessKey: nfeAccessKey().notNull().unique(),
  storeId: integer().references(() => storeTable.id).$type<Store['id']>(),
  status: invoiceStatusEnum().notNull(),
  emissionDate: timestamp(),
  processedAt: timestamp(),
  totalValue: integer(),
  ...timestamps,
})

export const invoiceRelations = relations(invoiceTable, ({ one, many }) => ({
  store: one(storeTable, {
    fields: [invoiceTable.storeId],
    references: [storeTable.id],
  }),
  invoiceProducts: many(invoiceProductTable),
}))

export const ProductUnit = {
  KG: 'KG',
  UN: 'UN',
  L: 'L',
} as const

export const productUnitEnum = pgEnum('product_unit', getEnumValues(ProductUnit))

export const productTable = pgTable('products', {
  id: id<'Product'>(),
  name: varchar({ length: 255 }).notNull(),
  unit: productUnitEnum(),
  ean: varchar({ length: 255 }).unique(),
  ...timestamps,
})

export const productRelations = relations(productTable, ({ many }) => ({
  invoices: many(invoiceProductTable),
  invoiceProducts: many(invoiceProductTable),
}))

export const invoiceProductTable = pgTable('invoice_products', {
  id: id<'InvoiceProduct'>(),
  invoiceId: integer().notNull().references(() => invoiceTable.id).$type<Invoice['id']>(),
  productId: integer().notNull().references(() => productTable.id).$type<Product['id']>(),
  quantity: numeric().notNull(),
  price: integer().notNull(),
  unitPrice: integer().notNull(),
  tax: integer(),
  discount: integer(),
})

export const invoiceProductRelations = relations(invoiceProductTable, ({ one }) => ({
  invoice: one(invoiceTable, {
    fields: [invoiceProductTable.invoiceId],
    references: [invoiceTable.id],
  }),
  product: one(productTable, {
    fields: [invoiceProductTable.productId],
    references: [productTable.id],
  }),
}))

export const storeProductTable = pgTable('store_products', {
  storeId: integer().notNull().references(() => storeTable.id).$type<Store['id']>(),
  productId: integer().notNull().references(() => productTable.id).$type<Product['id']>(),
  code: varchar({ length: 255 }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.storeId, table.productId]}),
])

export const storeProductRelations = relations(storeProductTable, ({ one }) => ({
  store: one(storeTable, {
    fields: [storeProductTable.storeId],
    references: [storeTable.id],
  }),
  product: one(productTable, {
    fields: [storeProductTable.productId],
    references: [productTable.id],
  }),
}))
