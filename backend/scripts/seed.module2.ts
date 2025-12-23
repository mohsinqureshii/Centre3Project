import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  /* =========================
     LOCATIONS
  ========================= */
  const locations = await prisma.location.createMany({
    data: [
      {
        country: "UAE",
        region: "Middle East",
        city: "Dubai",
        siteCode: "DXB-DC1",
        siteName: "Dubai Data Center 1",
      },
      {
        country: "UAE",
        region: "Middle East",
        city: "Dubai",
        siteCode: "DXB-DC2",
        siteName: "Dubai Data Center 2",
      },
      {
        country: "Saudi Arabia",
        region: "Middle East",
        city: "Riyadh",
        siteCode: "RUH-DC1",
        siteName: "Riyadh Data Center",
      },
      {
        country: "India",
        region: "APAC",
        city: "Mumbai",
        siteCode: "BOM-DC1",
        siteName: "Mumbai Data Center",
      },
      {
        country: "UK",
        region: "Europe",
        city: "London",
        siteCode: "LON-DC1",
        siteName: "London Data Center",
      },
    ],
  });

  const allLocations = await prisma.location.findMany();

  /* =========================
     ZONES
  ========================= */
  for (const loc of allLocations) {
    await prisma.zone.createMany({
      data: [
        {
          name: "Secure Zone",
          code: "SEC",
          isLockable: true,
          locationId: loc.id,
        },
        {
          name: "Operations Zone",
          code: "OPS",
          isLockable: true,
          locationId: loc.id,
        },
        {
          name: "Common Area",
          code: "COM",
          isLockable: false,
          locationId: loc.id,
        },
      ],
    });
  }

  const allZones = await prisma.zone.findMany();

  /* =========================
     ROOMS
  ========================= */
  for (const zone of allZones) {
    await prisma.room.createMany({
      data: [
        {
          name: "Room A",
          code: "A",
          zoneId: zone.id,
          locationId: zone.locationId,
        },
        {
          name: "Room B",
          code: "B",
          zoneId: zone.id,
          locationId: zone.locationId,
        },
      ],
    });
  }

  console.log("✅ Module-2 seed complete");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
