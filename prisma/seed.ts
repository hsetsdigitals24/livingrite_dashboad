import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@livingrite.com" },
    });

    if (existingAdmin) {
      console.log("✓ Admin user already exists:", existingAdmin.email);
      return;
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: "LivingRite Admin",
        email: "admin@livingrite.com",
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
        emailVerificaion: true,
        phone: "+1 (555) 000-0000",
        image: null,
      },
    });

    console.log("✓ Admin user created successfully:");
    console.log("  Email:", admin.email);
    console.log("  Default Password: Admin@12345");
    console.log("\n⚠️  Change this password immediately after first login!");
  } catch (error) {
    console.error("Error seeding admin user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
