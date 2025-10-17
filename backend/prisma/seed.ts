import {
  PrismaClient,
  UserRole,
  DocumentType,
  DocumentStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: adminPassword,
      firstName: "System",
      lastName: "Administrator",
      role: UserRole.ADMIN,
      badgeNumber: "ADM001",
    },
  });

  // Create officer user
  const officerPassword = await bcrypt.hash("officer123", 12);
  const officer = await prisma.user.upsert({
    where: { username: "officer1" },
    update: {},
    create: {
      username: "officer1",
      email: "officer1@example.com",
      password: officerPassword,
      firstName: "John",
      lastName: "Officer",
      role: UserRole.OFFICER,
      badgeNumber: "OFF001",
    },
  });

  // Create sample drivers
  const driver1 = await prisma.driver.create({
    data: {
      firstName: "Ahmed",
      lastName: "Ibrahim",
      middleName: "Musa",
      dateOfBirth: new Date("1985-03-15"),
      phoneNumber: "+2348012345678",
      email: "ahmed.ibrahim@example.com",
      address: "123 Lagos Street, Victoria Island, Lagos",
      stateOfOrigin: "Lagos",
      lga: "Lagos Island",
      nationality: "Nigerian",
      qrCode: "DRV001QR",
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      firstName: "Fatima",
      lastName: "Abdullahi",
      dateOfBirth: new Date("1990-07-22"),
      phoneNumber: "+2348087654321",
      email: "fatima.abdullahi@example.com",
      address: "456 Kano Road, Sabon Gari, Kano",
      stateOfOrigin: "Kano",
      lga: "Sabon Gari",
      nationality: "Nigerian",
      qrCode: "DRV002QR",
    },
  });

  // Create sample documents
  await prisma.document.create({
    data: {
      driverId: driver1.id,
      type: DocumentType.LICENSE,
      documentNumber: "LIC001234567",
      issueDate: new Date("2020-01-15"),
      expiryDate: new Date("2025-01-15"),
      issuingAuthority: "Federal Road Safety Corps",
      status: DocumentStatus.VALID,
      qrCode: "DOC001QR",
    },
  });

  await prisma.document.create({
    data: {
      driverId: driver1.id,
      type: DocumentType.INSURANCE,
      documentNumber: "INS001234567",
      issueDate: new Date("2023-01-01"),
      expiryDate: new Date("2024-01-01"),
      issuingAuthority: "AIICO Insurance",
      status: DocumentStatus.EXPIRED,
      qrCode: "DOC002QR",
    },
  });

  await prisma.document.create({
    data: {
      driverId: driver2.id,
      type: DocumentType.LICENSE,
      documentNumber: "LIC002345678",
      issueDate: new Date("2021-06-10"),
      expiryDate: new Date("2026-06-10"),
      issuingAuthority: "Federal Road Safety Corps",
      status: DocumentStatus.VALID,
      qrCode: "DOC003QR",
    },
  });

  // Create sample verification logs
  await prisma.verificationLog.create({
    data: {
      officerId: officer.id,
      driverId: driver1.id,
      result: "VALID",
      location: "Lagos Checkpoint",
      notes: "Routine verification",
      ipAddress: "192.168.1.1",
    },
  });

  await prisma.verificationLog.create({
    data: {
      officerId: officer.id,
      driverId: driver2.id,
      result: "VALID",
      location: "Kano Checkpoint",
      notes: "Document verification successful",
      ipAddress: "192.168.1.2",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("👤 Admin user: admin / admin123");
  console.log("👮 Officer user: officer1 / officer123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
