"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const verification_log_repository_1 = require("../repositories/verification-log.repository");
const document_repository_1 = require("../repositories/document.repository");
const driver_repository_1 = require("../repositories/driver.repository");
class VerificationService {
    constructor() {
        this.logRepo = new verification_log_repository_1.VerificationLogRepository();
        this.docRepo = new document_repository_1.DocumentRepository();
        this.driverRepo = new driver_repository_1.DriverRepository();
    }
    async verifyDriver(officerId, body, ipAddress, userAgent) {
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
    async verifyByQRCode(officerId, qrCodeData, location, notes, ipAddress, userAgent) {
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
            // Log verification attempt
            const verification = await this.logRepo.create({
                officerId,
                driverId: driver.id,
                result: driver.isActive ? "VALID" : "INVALID",
                ipAddress,
                userAgent,
                location,
                notes,
            });
            return {
                valid: driver.isActive,
                driver,
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
        let result = "VALID";
        if (!driver.isActive) {
            result = "INVALID";
        }
        else if (doc.status === "EXPIRED" ||
            new Date(doc.expiryDate) < new Date()) {
            result = "EXPIRED";
        }
        else if (doc.status === "SUSPENDED" || doc.status === "REVOKED") {
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
    async verifyByDocumentNumber(officerId, documentNumber, location, notes, ipAddress, userAgent) {
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
        let result = "VALID";
        if (!driver.isActive) {
            result = "INVALID";
        }
        else if (doc.status === "EXPIRED" ||
            new Date(doc.expiryDate) < new Date()) {
            result = "EXPIRED";
        }
        else if (doc.status === "SUSPENDED" || doc.status === "REVOKED") {
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
    async getVerificationHistory(officerId, limit = 50) {
        return this.logRepo.findByOfficerId(officerId, limit);
    }
    async getDriverVerificationHistory(driverId) {
        return this.logRepo.findByDriverId(driverId);
    }
    async getOfficerStats(officerId, days = 30) {
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
exports.VerificationService = VerificationService;
