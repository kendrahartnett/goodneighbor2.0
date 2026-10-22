ALTER TABLE "ListingRequest" ADD COLUMN "archivedAt" TIMESTAMP(3);

CREATE INDEX "ListingRequest_archivedAt_createdAt_id_idx" ON "ListingRequest"("archivedAt", "createdAt", "id");
