import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.opportunity.findMany({
      select: {
        status: true,
        verifiedAt: true,
        sourceUrl: true,
        organizerUrl: true,
      },
    });

    const result = {
      total: rows.length,
      published: rows.filter((row) => row.status === "PUBLISHED").length,
      valid: rows.every(
        (row) => row.verifiedAt && row.sourceUrl && row.organizerUrl,
      ),
    };

    console.log(result);

    if (result.total !== 8 || result.published !== 8 || !result.valid) {
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main();
