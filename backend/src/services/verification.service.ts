import { VerificationLogRepository } from "../repositories/verification-log.repository";
import { DocumentRepository } from "../repositories/document.repository";
import { DriverRepository, DriverWithDocuments } from "../repositories/driver.repository";

export class VerificationService {
  private logRepo: VerificationLogRepository;
  private docRepo: DocumentRepository;
  private driverRepo: DriverRepository;

  constructor() {
    this.logRepo = new VerificationLogRepository();
    this.docRepo = new DocumentRepository();
    this.driverRepo = new DriverRepository();
  }

  async verifyDriver(
    officerId: string,
    body: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Implementation for direct verification
    // This is a stub - implement actual verification logic here
    const result = { ok: true };

    // Log the verification attempt
    if (body.driverId) {
      await this.logRepo.create({
        officerId,
        driverId: body.driverId,
        documentId: body.documentId,
        result: "SUCCESS", // or determine based on verification
        ipAddress,
        userAgent,
        location: body.location,
        notes: body.notes,
      });
    }

    return result;
  }

  async verifyByQRCode(
    officerId: string,
    qrCodeData: string,
    location?: string,
    notes?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Try to find document by QR code
    const doc = await this.docRepo.findByQRCode(qrCodeData);

    if (!doc) {
      // Try to find driver by QR code
      const driver = await this.driverRepo.findByQRCode(qrCodeData);

      if (!driver) {
        return {
          valid: false,
          error: "QR code not found in system",
        };
      }

      // Get the latest document for the driver
      const latestDocument = driver.documents && driver.documents.length > 0 
        ? driver.documents[0] 
        : null;

      // Log verification attempt
      const verification = await this.logRepo.create({
        officerId,
        driverId: driver.id,
        documentId: latestDocument?.id,
        result: driver.isActive ? "VALID" : "INVALID",
        ipAddress,
        userAgent,
        location,
        notes,
      });

      return {
        valid: driver.isActive,
        driver: {
          ...driver,
          documents: undefined, // Remove the documents from the driver object to avoid circular reference
        },
        document: latestDocument,
        verification: {
          id: verification.id,
          result: verification.result,
          timestamp: verification.createdAt.toISOString(),
        },
      };
    }

    // Document found - check its status
    const driver = await this.driverRepo.findById(doc.driverId);

    if (!driver) {
      return {
        valid: false,
        error: "Driver not found",
      };
    }

    // Determine verification result
    let result: "VALID" | "INVALID" | "EXPIRED" | "FORGED" = "VALID";

    if (!driver.isActive) {
      result = "INVALID";
    } else if (
      doc.status === "EXPIRED" ||
      new Date(doc.expiryDate) < new Date()
    ) {
      result = "EXPIRED";
    } else if (doc.status === "SUSPENDED" || doc.status === "REVOKED") {
      result = "INVALID";
    }

    // Log verification
    const verification = await this.logRepo.create({
      officerId,
      driverId: driver.id,
      documentId: doc.id,
      result,
      ipAddress,
      userAgent,
      location,
      notes,
    });

    return {
      valid: result === "VALID",
      driver,
      document: doc,
      verification: {
        id: verification.id,
        result: verification.result,
        timestamp: verification.createdAt.toISOString(),
      },
    };
  }

  async verifyByDocumentNumber(
    officerId: string,
    documentNumber: string,
    location?: string,
    notes?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const doc = await this.docRepo.findByDocumentNumber(documentNumber);

    if (!doc) {
      return {
        valid: false,
        error: "Document number not found",
      };
    }

    const driver = await this.driverRepo.findById(doc.driverId);

    if (!driver) {
      return {
        valid: false,
        error: "Driver not found",
      };
    }

    // Determine verification result
    let result: "VALID" | "INVALID" | "EXPIRED" | "FORGED" = "VALID";

    if (!driver.isActive) {
      result = "INVALID";
    } else if (
      doc.status === "EXPIRED" ||
      new Date(doc.expiryDate) < new Date()
    ) {
      result = "EXPIRED";
    } else if (doc.status === "SUSPENDED" || doc.status === "REVOKED") {
      result = "INVALID";
    }

    // Log verification
    const verification = await this.logRepo.create({
      officerId,
      driverId: driver.id,
      documentId: doc.id,
      result,
      ipAddress,
      userAgent,
      location,
      notes,
    });

    return {
      valid: result === "VALID",
      driver,
      document: doc,
      verification: {
        id: verification.id,
        result: verification.result,
        timestamp: verification.createdAt.toISOString(),
      },
    };
  }

  async getVerificationHistory(officerId: string, limit = 50) {
    return this.logRepo.findByOfficerId(officerId, limit);
  }

  async getDriverVerificationHistory(driverId: string) {
    return this.logRepo.findByDriverId(driverId);
  }

  async getOfficerStats(officerId: string, days = 30) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    return this.logRepo.getStatsByOfficer(officerId, start, end);
  }

  async getSystemStats(days = 30) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    return this.logRepo.getSystemStats(start, end);
  }
}
