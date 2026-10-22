CREATE TYPE "OpportunityStatus" AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE "DateType" AS ENUM ('ONGOING', 'DATE_SPECIFIC', 'NEXT_OCCURRENCE');
CREATE TYPE "Category" AS ENUM ('FOOD_SECURITY', 'ENVIRONMENT', 'YOUTH_COMMUNITY', 'HOUSING_HEALTH');
CREATE TABLE "Opportunity" ("id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "organizationName" TEXT NOT NULL, "summary" VARCHAR(280) NOT NULL, "description" TEXT NOT NULL, "category" "Category" NOT NULL, "neighborhood" TEXT NOT NULL, "addressText" TEXT, "dateType" "DateType" NOT NULL, "startsAt" TIMESTAMP(3), "endsAt" TIMESTAMP(3), "timeZone" TEXT NOT NULL DEFAULT 'America/Chicago', "commitmentText" TEXT, "accessibilityText" TEXT, "eligibilityText" TEXT, "imageUrl" TEXT, "imageAlt" TEXT, "organizerUrl" TEXT NOT NULL, "sourceUrl" TEXT NOT NULL, "verifiedAt" TIMESTAMP(3) NOT NULL, "status" "OpportunityStatus" NOT NULL DEFAULT 'DRAFT', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Opportunity_slug_key" ON "Opportunity"("slug");
CREATE INDEX "Opportunity_status_idx" ON "Opportunity"("status");
CREATE INDEX "Opportunity_category_idx" ON "Opportunity"("category");
CREATE INDEX "Opportunity_verifiedAt_idx" ON "Opportunity"("verifiedAt");
