ALTER TABLE "Opportunity" ADD COLUMN "publishedAt" TIMESTAMP(3);

-- Historical publish times were not stored. Existing published rows use their creation time.
UPDATE "Opportunity" SET "publishedAt" = "createdAt" WHERE "status" = 'PUBLISHED';

CREATE INDEX "Opportunity_status_publishedAt_id_idx" ON "Opportunity"("status", "publishedAt", "id");

CREATE TABLE "ListingRequest" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "contactInformation" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "photoUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ListingRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ListingRequest_createdAt_id_idx" ON "ListingRequest"("createdAt", "id");
