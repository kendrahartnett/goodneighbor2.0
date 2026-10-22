import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [published, missingPublicationTime, requests] = await Promise.all([
    prisma.opportunity.count({ where: { status: "PUBLISHED" } }),
    prisma.opportunity.count({ where: { status: "PUBLISHED", publishedAt: null } }),
    prisma.listingRequest.count(),
  ]);
  console.log({ published, missingPublicationTime, requests });
  if (missingPublicationTime) process.exitCode = 1;
}

main().catch(() => { console.error("Publication verification failed."); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
