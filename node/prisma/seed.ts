import { PrismaClient } from "@prisma/client";
import statusSeeds from "./seed/statuses.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.status.deleteMany();
  await prisma.request.deleteMany();

  for (const status of statusSeeds) {
    await prisma.status.create({ data: status });
  }

  console.log("Database has been seeded.");
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
