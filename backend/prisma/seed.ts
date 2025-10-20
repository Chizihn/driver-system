import { PrismaClient, UserRole, DocumentType, DocumentStatus, VerificationResult } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Helper to generate QR code data
const generateQRCodeData = (driverId: string, documentId: string) => {
  return JSON.stringify({
    documentId,
    driverId,
    timestamp: Date.now(),
    token: uuidv4()
  });
};

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

  // Create test driver with valid documents
  const testDriver = await prisma.driver.create({
    data: {
      firstName: "Test",
      lastName: "Driver",
      middleName: "QR",
      dateOfBirth: new Date("1990-01-01"),
      phoneNumber: "+2347000000001",
      email: "test.driver@example.com",
      address: "123 Test Street, Test City",
      stateOfOrigin: "Lagos",
      lga: "Ikeja",
      nationality: "Nigerian",
      isActive: true,
    },
  });

  // Create test officer for verification
  const testOfficerPassword = await bcrypt.hash("testofficer123", 12);
  const testOfficer = await prisma.user.upsert({
    where: { username: "testofficer" },
    update: {},
    create: {
      username: "testofficer",
      email: "test.officer@example.com",
      password: testOfficerPassword,
      firstName: "Test",
      lastName: "Officer",
      role: UserRole.OFFICER,
      badgeNumber: "TST001",
    },
  });

  // Create test documents for the driver
  const licenseDoc = await prisma.document.create({
    data: {
      driverId: testDriver.id,
      type: DocumentType.LICENSE,
      documentNumber: "TESTLIC123456",
      issueDate: new Date("2023-01-01"),
      expiryDate: new Date("2030-01-01"),
      issuingAuthority: "FRSC Test",
      status: DocumentStatus.VALID,
      qrCode: generateQRCodeData(testDriver.id, `doc_${uuidv4()}`),
    },
  });

  const insuranceDoc = await prisma.document.create({
    data: {
      driverId: testDriver.id,
      type: DocumentType.INSURANCE,
      documentNumber: "TESTINS123456",
      issueDate: new Date("2023-01-01"),
      expiryDate: new Date("2024-12-31"),
      issuingAuthority: "Test Insurance Co.",
      status: DocumentStatus.VALID,
      qrCode: generateQRCodeData(testDriver.id, `doc_${uuidv4()}`),
    },
  });

  // Update driver with QR code from license
  await prisma.driver.update({
    where: { id: testDriver.id },
    data: {
      qrCode: generateQRCodeData(testDriver.id, licenseDoc.id)
    },
  });

  // Create test verification log
  await prisma.verificationLog.create({
    data: {
      officerId: testOfficer.id,
      driverId: testDriver.id,
      documentId: licenseDoc.id,
      result: VerificationResult.VALID,
      location: "Test Checkpoint",
      notes: "Initial test verification",
      ipAddress: "127.0.0.1",
    },
  });

  // Create additional test documents for the test driver
  await prisma.document.create({
    data: {
      driverId: testDriver.id,
      type: DocumentType.REGISTRATION,
      documentNumber: "TESTREG123456",
      issueDate: new Date("2023-01-01"),
      expiryDate: new Date("2030-12-31"),
      issuingAuthority: "Lagos State Motor Vehicle Admin",
      status: DocumentStatus.VALID,
      qrCode: generateQRCodeData(testDriver.id, `doc_${uuidv4()}`),
    },
  });

  // Create additional test verification logs
  await prisma.verificationLog.create({
    data: {
      officerId: testOfficer.id,
      driverId: testDriver.id,
      documentId: licenseDoc.id,
      result: VerificationResult.VALID,
      location: "Test Checkpoint 2",
      notes: "Follow-up verification",
      ipAddress: "127.0.0.2",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n🔑 Test Credentials:");
  console.log("👤 Admin user: admin / admin123");
  console.log("👮 Officer user: officer1 / officer123");
  console.log("👮 Test Officer: testofficer / testofficer123");
  
  console.log("\n🔗 Test Driver QR Code Data:", {
    driverId: testDriver.id,
    licenseId: licenseDoc.id,
    qrCode: generateQRCodeData(testDriver.id, licenseDoc.id)
  });
  
  console.log("\n🔍 Test QR Code Verification Endpoint:");
  console.log(`POST /api/qr/verify`);
  console.log(`Body: { "qrCodeData": "${generateQRCodeData(testDriver.id, licenseDoc.id)}" }`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
