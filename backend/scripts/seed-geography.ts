import prisma from "../src/prisma";

async function seed() {
  console.log("Seeding Saudi geography...");

  // Optional: Clear previous data to avoid duplicates
  await prisma.room.deleteMany({});
  await prisma.zone.deleteMany({});
  await prisma.location.deleteMany({});

  for (let i = 1; i <= 10; i++) {
    // 1️⃣ Create location
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
      // 2️⃣ Create zone with nested connect to location
      const zone = await prisma.zone.create({
        data: {
          name: `Zone ${z}`,
          location: { connect: { id: location.id } },
          isActive: true,
          isLockable: true,
        },
      });

      for (let r = 1; r <= 10; r++) {
        // 3️⃣ Create room with nested connect to zone and location
        await prisma.room.create({
          data: {
            name: `Room ${r}`,
            zone: { connect: { id: zone.id } },
            location: { connect: { id: location.id } },
          },
        });
      }
    }
  }

  console.log("✅ Seeding complete");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
