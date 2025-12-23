import { prisma } from "../src/prisma";

async function seed() {
  console.log("Seeding Saudi geography...");

  for (let i = 1; i <= 10; i++) {
    const location = await prisma.location.create({
      data: {
        country: "Saudi Arabia",
        region: "Middle East",
        city: "Riyadh",
        siteCode: `KSA-DC${i}`,
        siteName: `Saudi Data Centre ${i}`,
        isActive: true,
      },
    });

    for (let z = 1; z <= 5; z++) {
      const zone = await prisma.zone.create({
        data: {
          name: `Zone ${z}`,
          locationId: location.id,
        },
      });

      for (let r = 1; r <= 10; r++) {
        await prisma.room.create({
          data: {
            name: `Room ${r}`,
            zoneId: zone.id,
          },
        });
      }
    }
  }

  console.log("✅ Seeding complete");
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
