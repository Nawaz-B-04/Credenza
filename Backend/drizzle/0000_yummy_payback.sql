CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"store_id" integer,
	"rating" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'store',
	CONSTRAINT "stores_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;