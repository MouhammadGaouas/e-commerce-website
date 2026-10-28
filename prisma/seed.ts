import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { sampleProducts } from "@/mocks/product.mock";

const databaseUrl = process.env.DATABASE_URL;



if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in your environment.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("🌱 Starting database seed...");

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: item,
      });
      updatedCount++;
    } else {
      await prisma.product.create({
        data: item,
      });
      createdCount++;
    }
  }



  console.log(
    `✅ Seeding complete! Created: ${createdCount} products, Updated: ${updatedCount} products.`
  );
  console.log(`📦 Total sample products in database: ${sampleProducts.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
