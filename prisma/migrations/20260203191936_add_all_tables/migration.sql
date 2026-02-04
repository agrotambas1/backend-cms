-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "url" TEXT,
    "path" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "alt_text" TEXT,
    "caption" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_id" UUID NOT NULL,
    "link_image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "article_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail_id" UUID,
    "publication_id" UUID,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "status" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "scheduled_at" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "category_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pivot_article_tags" (
    "article_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pivot_article_tags_pkey" PRIMARY KEY ("article_id","tag_id")
);

-- CreateTable
CREATE TABLE "article_seo_keywords" (
    "id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "keyword" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_seo_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solutions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industries" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capabilities" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "thumbnail_id" UUID,
    "event_type" TEXT,
    "event_start" TIMESTAMP(3) NOT NULL,
    "event_end" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "location_type" TEXT NOT NULL,
    "meetingUrl" TEXT,
    "registration_url" TEXT,
    "quota" INTEGER,
    "status" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pivot_event_solutions" (
    "event_id" UUID NOT NULL,
    "solution_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pivot_event_solutions_pkey" PRIMARY KEY ("event_id","solution_id")
);

-- CreateTable
CREATE TABLE "case_studies" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "content" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "outcomes" JSONB,
    "client" TEXT,
    "project_url" TEXT,
    "demo_url" TEXT,
    "duration" TEXT,
    "year" INTEGER,
    "thumbnail_id" UUID,
    "publication_id" UUID,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pivot_case_study_solutions" (
    "case_study_id" UUID NOT NULL,
    "solution_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pivot_case_study_solutions_pkey" PRIMARY KEY ("case_study_id","solution_id")
);

-- CreateTable
CREATE TABLE "pivot_case_study_industries" (
    "case_study_id" UUID NOT NULL,
    "industry_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pivot_case_study_industries_pkey" PRIMARY KEY ("case_study_id","industry_id")
);

-- CreateTable
CREATE TABLE "pivot_case_study_capabilities" (
    "case_study_id" UUID NOT NULL,
    "capability_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pivot_case_study_capabilities_pkey" PRIMARY KEY ("case_study_id","capability_id")
);

-- CreateTable
CREATE TABLE "case_study_seo_keywords" (
    "id" UUID NOT NULL,
    "case_study_id" UUID NOT NULL,
    "keyword" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_study_seo_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_role_is_active_deleted_at_idx" ON "users"("role", "is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "users_is_active_deleted_at_idx" ON "users"("is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_deleted_at_key" ON "users"("username", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_deleted_at_key" ON "users"("email", "deleted_at");

-- CreateIndex
CREATE INDEX "media_created_by_deleted_at_idx" ON "media"("created_by", "deleted_at");

-- CreateIndex
CREATE INDEX "media_mime_type_deleted_at_idx" ON "media"("mime_type", "deleted_at");

-- CreateIndex
CREATE INDEX "media_created_at_idx" ON "media"("created_at" DESC);

-- CreateIndex
CREATE INDEX "media_deleted_at_mime_type_created_at_idx" ON "media"("deleted_at", "mime_type", "created_at");

-- CreateIndex
CREATE INDEX "banner_status_start_date_end_date_idx" ON "banner"("status", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "banner_deleted_at_status_order_idx" ON "banner"("deleted_at", "status", "order");

-- CreateIndex
CREATE INDEX "banner_status_deleted_at_idx" ON "banner"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "banner_order_deleted_at_idx" ON "banner"("order", "deleted_at");

-- CreateIndex
CREATE INDEX "banner_start_date_end_date_status_deleted_at_idx" ON "banner"("start_date", "end_date", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "article_categories_is_active_deleted_at_idx" ON "article_categories"("is_active", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "article_categories_slug_deleted_at_key" ON "article_categories"("slug", "deleted_at");

-- CreateIndex
CREATE INDEX "article_tags_is_active_deleted_at_idx" ON "article_tags"("is_active", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "article_tags_slug_deleted_at_key" ON "article_tags"("slug", "deleted_at");

-- CreateIndex
CREATE INDEX "articles_status_deleted_at_idx" ON "articles"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "articles_is_featured_deleted_at_idx" ON "articles"("is_featured", "deleted_at");

-- CreateIndex
CREATE INDEX "articles_category_id_deleted_at_status_idx" ON "articles"("category_id", "deleted_at", "status");

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at" DESC);

-- CreateIndex
CREATE INDEX "articles_created_at_idx" ON "articles"("created_at" DESC);

-- CreateIndex
CREATE INDEX "articles_view_count_idx" ON "articles"("view_count" DESC);

-- CreateIndex
CREATE INDEX "articles_deleted_at_status_published_at_idx" ON "articles"("deleted_at", "status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_deleted_at_key" ON "articles"("slug", "deleted_at");

-- CreateIndex
CREATE INDEX "pivot_article_tags_tag_id_idx" ON "pivot_article_tags"("tag_id");

-- CreateIndex
CREATE INDEX "article_seo_keywords_article_id_idx" ON "article_seo_keywords"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_seo_keywords_article_id_keyword_key" ON "article_seo_keywords"("article_id", "keyword");

-- CreateIndex
CREATE INDEX "solutions_is_active_deleted_at_idx" ON "solutions"("is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "solutions_order_deleted_at_idx" ON "solutions"("order", "deleted_at");

-- CreateIndex
CREATE INDEX "solutions_is_active_order_deleted_at_idx" ON "solutions"("is_active", "order", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "solutions_slug_deleted_at_key" ON "solutions"("slug", "deleted_at");

-- CreateIndex
CREATE INDEX "industries_is_active_deleted_at_idx" ON "industries"("is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "industries_order_deleted_at_idx" ON "industries"("order", "deleted_at");

-- CreateIndex
CREATE INDEX "industries_is_active_order_deleted_at_idx" ON "industries"("is_active", "order", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "industries_slug_deleted_at_key" ON "industries"("slug", "deleted_at");

-- CreateIndex
CREATE INDEX "capabilities_is_active_deleted_at_idx" ON "capabilities"("is_active", "deleted_at");

-- CreateIndex
CREATE INDEX "capabilities_order_deleted_at_idx" ON "capabilities"("order", "deleted_at");

-- CreateIndex
CREATE INDEX "capabilities_is_active_order_deleted_at_idx" ON "capabilities"("is_active", "order", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "capabilities_slug_deleted_at_key" ON "capabilities"("slug", "deleted_at");

-- CreateIndex
CREATE INDEX "events_status_deleted_at_idx" ON "events"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "events_is_featured_deleted_at_idx" ON "events"("is_featured", "deleted_at");

-- CreateIndex
CREATE INDEX "events_event_start_deleted_at_idx" ON "events"("event_start", "deleted_at");

-- CreateIndex
CREATE INDEX "events_event_end_deleted_at_idx" ON "events"("event_end", "deleted_at");

-- CreateIndex
CREATE INDEX "events_event_start_event_end_status_deleted_at_idx" ON "events"("event_start", "event_end", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "events_location_type_deleted_at_idx" ON "events"("location_type", "deleted_at");

-- CreateIndex
CREATE INDEX "events_status_event_start_deleted_at_idx" ON "events"("status", "event_start", "deleted_at");

-- CreateIndex
CREATE INDEX "events_is_featured_event_start_deleted_at_idx" ON "events"("is_featured", "event_start", "deleted_at");

-- CreateIndex
CREATE INDEX "events_event_type_deleted_at_idx" ON "events"("event_type", "deleted_at");

-- CreateIndex
CREATE INDEX "events_created_at_idx" ON "events"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_deleted_at_key" ON "events"("slug", "deleted_at");

-- CreateIndex
CREATE INDEX "pivot_event_solutions_solution_id_idx" ON "pivot_event_solutions"("solution_id");

-- CreateIndex
CREATE INDEX "case_studies_status_deleted_at_idx" ON "case_studies"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "case_studies_is_featured_deleted_at_idx" ON "case_studies"("is_featured", "deleted_at");

-- CreateIndex
CREATE INDEX "case_studies_status_published_at_deleted_at_idx" ON "case_studies"("status", "published_at", "deleted_at");

-- CreateIndex
CREATE INDEX "case_studies_year_deleted_at_idx" ON "case_studies"("year", "deleted_at");

-- CreateIndex
CREATE INDEX "case_studies_is_featured_status_deleted_at_idx" ON "case_studies"("is_featured", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "case_studies_order_deleted_at_idx" ON "case_studies"("order", "deleted_at");

-- CreateIndex
CREATE INDEX "case_studies_status_order_deleted_at_idx" ON "case_studies"("status", "order", "deleted_at");

-- CreateIndex
CREATE INDEX "case_studies_published_at_idx" ON "case_studies"("published_at" DESC);

-- CreateIndex
CREATE INDEX "case_studies_created_at_idx" ON "case_studies"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_slug_deleted_at_key" ON "case_studies"("slug", "deleted_at");

-- CreateIndex
CREATE INDEX "pivot_case_study_solutions_solution_id_idx" ON "pivot_case_study_solutions"("solution_id");

-- CreateIndex
CREATE INDEX "pivot_case_study_industries_industry_id_idx" ON "pivot_case_study_industries"("industry_id");

-- CreateIndex
CREATE INDEX "pivot_case_study_capabilities_capability_id_idx" ON "pivot_case_study_capabilities"("capability_id");

-- CreateIndex
CREATE INDEX "case_study_seo_keywords_case_study_id_idx" ON "case_study_seo_keywords"("case_study_id");

-- CreateIndex
CREATE UNIQUE INDEX "case_study_seo_keywords_case_study_id_keyword_key" ON "case_study_seo_keywords"("case_study_id", "keyword");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner" ADD CONSTRAINT "banner_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner" ADD CONSTRAINT "banner_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner" ADD CONSTRAINT "banner_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "article_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_article_tags" ADD CONSTRAINT "pivot_article_tags_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_article_tags" ADD CONSTRAINT "pivot_article_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "article_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_seo_keywords" ADD CONSTRAINT "article_seo_keywords_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_event_solutions" ADD CONSTRAINT "pivot_event_solutions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_event_solutions" ADD CONSTRAINT "pivot_event_solutions_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_case_study_solutions" ADD CONSTRAINT "pivot_case_study_solutions_case_study_id_fkey" FOREIGN KEY ("case_study_id") REFERENCES "case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_case_study_solutions" ADD CONSTRAINT "pivot_case_study_solutions_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_case_study_industries" ADD CONSTRAINT "pivot_case_study_industries_case_study_id_fkey" FOREIGN KEY ("case_study_id") REFERENCES "case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_case_study_industries" ADD CONSTRAINT "pivot_case_study_industries_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_case_study_capabilities" ADD CONSTRAINT "pivot_case_study_capabilities_case_study_id_fkey" FOREIGN KEY ("case_study_id") REFERENCES "case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_case_study_capabilities" ADD CONSTRAINT "pivot_case_study_capabilities_capability_id_fkey" FOREIGN KEY ("capability_id") REFERENCES "capabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_study_seo_keywords" ADD CONSTRAINT "case_study_seo_keywords_case_study_id_fkey" FOREIGN KEY ("case_study_id") REFERENCES "case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
