import prisma from "../src/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  const hash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@centre3.local" },
    update: {},
    create: {
      fullName: "Super Admin",
      email: "admin@centre3.local",
      passwordHash: hash,
      role: "SUPER_ADMIN",
      phone: "123456",
    },
  });

  console.log("✅ Admin user created");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
