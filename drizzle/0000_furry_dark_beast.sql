CREATE TYPE "public"."invoice_status" AS ENUM('PENDING', 'PROCESSED', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."product_unit" AS ENUM('KG', 'UN', 'L');--> statement-breakpoint
CREATE TABLE "invoice_products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoice_products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"invoice_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" numeric NOT NULL,
	"price" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"tax" integer,
	"discount" integer
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"access_key" varchar(44) NOT NULL,
	"store_id" integer,
	"status" "invoice_status" NOT NULL,
	"emission_date" timestamp,
	"processed_at" timestamp,
	"total_value" integer,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'UTC'::TEXT) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'UTC'::TEXT) NOT NULL,
	CONSTRAINT "invoices_accessKey_unique" UNIQUE("access_key")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"unit" "product_unit",
	"ean" varchar(255),
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'UTC'::TEXT) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'UTC'::TEXT) NOT NULL,
	CONSTRAINT "products_ean_unique" UNIQUE("ean")
);
--> statement-breakpoint
CREATE TABLE "store_products" (
	"store_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"code" varchar(255) NOT NULL,
	CONSTRAINT "store_products_store_id_product_id_pk" PRIMARY KEY("store_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"cnpj" varchar(14) NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'UTC'::TEXT) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'UTC'::TEXT) NOT NULL,
	CONSTRAINT "stores_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
ALTER TABLE "invoice_products" ADD CONSTRAINT "invoice_products_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_products" ADD CONSTRAINT "invoice_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;