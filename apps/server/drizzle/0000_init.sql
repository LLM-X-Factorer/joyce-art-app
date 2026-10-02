CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coffee_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"name" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"description" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"note" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"zh_status" text DEFAULT 'missing' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coffee_options_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "concept_guides" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"label" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"keywords" jsonb DEFAULT '{"en":[],"zh":[]}'::jsonb NOT NULL,
	"work_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"response" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"implication" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"zh_status" text DEFAULT 'missing' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "concept_guides_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "email_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"purpose" text NOT NULL,
	"code_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"consumed_at" timestamp with time zone,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eras" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"number" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"label" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"range" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"summary" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"start_year" integer,
	"end_year" integer,
	"zh_status" text DEFAULT 'missing' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "eras_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "essay_drafts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"work_id" integer NOT NULL,
	"mode" text NOT NULL,
	"thesis" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "greek_highlights" (
	"id" serial PRIMARY KEY NOT NULL,
	"work_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"image_position" text,
	"theme" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"look_for" jsonb DEFAULT '{"en":[],"zh":[]}'::jsonb NOT NULL,
	"why_it_matters" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"note" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"zh_status" text DEFAULT 'missing' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "greek_highlights_work_id_unique" UNIQUE("work_id")
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"path" text NOT NULL,
	"thumb_path" text NOT NULL,
	"width" integer,
	"height" integer,
	"original_url" text,
	"source_page" text,
	"author" text,
	"license" text,
	"license_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "images_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "painter_works" (
	"id" serial PRIMARY KEY NOT NULL,
	"painter_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"work_id" integer,
	"title" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"date" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"start_year" integer,
	"image_id" integer,
	"image_position" text,
	"visual" jsonb DEFAULT '{"en":[],"zh":[]}'::jsonb NOT NULL,
	"context" jsonb DEFAULT '{"en":[],"zh":[]}'::jsonb NOT NULL,
	"exam" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"zh_status" text DEFAULT 'missing' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "painters" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"name" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"years" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"birth_year" integer,
	"death_year" integer,
	"country_key" text NOT NULL,
	"country" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"period_key" text NOT NULL,
	"period" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"movement" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"hook" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"position" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"zh_status" text DEFAULT 'missing' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "painters_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"author_id" uuid,
	"body" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"sent_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "replies_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE "saved_works" (
	"user_id" uuid NOT NULL,
	"work_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_works_user_id_work_id_pk" PRIMARY KEY("user_id","work_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"work_id" integer NOT NULL,
	"mode" text NOT NULL,
	"thesis" text DEFAULT '' NOT NULL,
	"body" text NOT NULL,
	"help_requested" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"close_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_counters" (
	"bucket" text NOT NULL,
	"day" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "usage_counters_bucket_day_pk" PRIMARY KEY("bucket","day")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text,
	"role" text DEFAULT 'user' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"locale" text DEFAULT 'zh' NOT NULL,
	"email_verified_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"era_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"category" text NOT NULL,
	"title" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"date" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"start_year" integer,
	"end_year" integer,
	"culture" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"image_id" integer,
	"image_position" text,
	"context" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"visual" jsonb DEFAULT '{"en":[],"zh":[]}'::jsonb NOT NULL,
	"implications" jsonb DEFAULT '{"en":"","zh":""}'::jsonb NOT NULL,
	"questions" jsonb DEFAULT '{"en":[],"zh":[]}'::jsonb NOT NULL,
	"source" text,
	"source_url" text,
	"published" boolean DEFAULT true NOT NULL,
	"zh_status" text DEFAULT 'missing' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "works_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "workshop_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"wechat" text DEFAULT '' NOT NULL,
	"school" text DEFAULT '' NOT NULL,
	"grade" text DEFAULT '' NOT NULL,
	"exam_board" text DEFAULT '' NOT NULL,
	"exam_session" text DEFAULT '' NOT NULL,
	"current_needs" text NOT NULL,
	"preferred_format" text DEFAULT '' NOT NULL,
	"consent_contact" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"admin_notes" text DEFAULT '' NOT NULL,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_drafts" ADD CONSTRAINT "essay_drafts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_drafts" ADD CONSTRAINT "essay_drafts_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "greek_highlights" ADD CONSTRAINT "greek_highlights_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "painter_works" ADD CONSTRAINT "painter_works_painter_id_painters_id_fk" FOREIGN KEY ("painter_id") REFERENCES "public"."painters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "painter_works" ADD CONSTRAINT "painter_works_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "painter_works" ADD CONSTRAINT "painter_works_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_works" ADD CONSTRAINT "saved_works_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_works" ADD CONSTRAINT "saved_works_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_era_id_eras_id_fk" FOREIGN KEY ("era_id") REFERENCES "public"."eras"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workshop_applications" ADD CONSTRAINT "workshop_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_messages_user_idx" ON "chat_messages" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "email_codes_email_idx" ON "email_codes" USING btree ("email","purpose");--> statement-breakpoint
CREATE UNIQUE INDEX "essay_drafts_unique" ON "essay_drafts" USING btree ("user_id","work_id","mode");--> statement-breakpoint
CREATE INDEX "painter_works_painter_idx" ON "painter_works" USING btree ("painter_id");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "submissions_user_idx" ON "submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "submissions_status_idx" ON "submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "works_era_idx" ON "works" USING btree ("era_id");--> statement-breakpoint
CREATE INDEX "workshop_applications_status_idx" ON "workshop_applications" USING btree ("status");