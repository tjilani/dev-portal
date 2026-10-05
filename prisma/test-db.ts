import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const start = performance.now();
  await prisma.$queryRaw`SELECT 1`;
  console.log(`Connected in ${Math.round(performance.now() - start)}ms\n`);

  const [users, itemTypes, collections, items, tags] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);
  console.table({ users, itemTypes, collections, items, tags });

  const types = await prisma.itemType.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });
  console.log("\nItem types:");
  for (const type of types) {
    console.log(`  ${type.slug.padEnd(10)} ${type.icon.padEnd(11)} ${type.color}  ${type._count.items} items`);
  }

  const userList = await prisma.user.findMany({
    include: {
      collections: {
        orderBy: { name: "asc" },
        include: { items: { include: { item: { include: { itemType: true } } } } },
      },
    },
  });
  for (const user of userList) {
    console.log(`\nUser: ${user.name} <${user.email}> (${user.isPro ? "Pro" : "Free"})`);
    for (const collection of user.collections) {
      console.log(`  ${collection.name} (${collection.items.length} items)`);
      for (const { item } of collection.items) {
        console.log(`    [${item.itemType.name}] ${item.title}`);
      }
    }
  }
}

main()
  .catch((error) => {
    console.error("Database test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
