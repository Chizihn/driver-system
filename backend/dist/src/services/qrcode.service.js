"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeService = void 0;
// src/services/qrcode.service.ts
const qrcode_1 = __importDefault(require("qrcode"));
const document_repository_1 = require("../repositories/document.repository");
const verification_log_repository_1 = require("../repositories/verification-log.repository");
const client_1 = require("@prisma/client");
class QRCodeService {
    constructor() {
        this.docRepo = new document_repository_1.DocumentRepository();
        this.verificationLogRepo = new verification_log_repository_1.VerificationLogRepository();
    }
    // Get driver's license document (treated as primary for verification)
    async getDriverPrimaryDocument(driverId) {
        const documents = await this.docRepo.findByDriverId(driverId);
        // Find the driver's license or first available document
        return documents.find(doc => doc.type === 'LICENSE') || documents[0] || null;
    }
    // Generate a new QR code for a driver's document
    async generateQRCode(driverId, documentId) {
        const qrData = {
            documentId,
            driverId,
            timestamp: Date.now()
        };
        // Get current document to preserve existing metadata
        const currentDoc = await this.docRepo.findById(documentId);
        const currentMetadata = currentDoc?.metadata || {};
        // Update document with QR code and metadata
        await this.docRepo.update(documentId, {
            qrCode: JSON.stringify(qrData),
            metadata: {
                ...(typeof currentMetadata === 'object' ? currentMetadata : {}),
                lastQrGenerated: new Date().toISOString()
            }
        });
        return qrcode_1.default.toDataURL(JSON.stringify(qrData));
    }
    // Verify a scanned QR code
    async verifyQRCode(qrData) {
        try {
            const data = JSON.parse(qrData);
            // Basic validation
            if (!data.documentId || !data.driverId) {
                throw new Error('Invalid QR code format');
            }
            // Get the document from database
            const document = await this.docRepo.findById(data.documentId);
            if (!document) {
                await this.logVerification({
                    documentId: data.documentId,
                    driverId: data.driverId,
                    result: client_1.VerificationResult.INVALID,
                    notes: 'Document not found'
                });
                return { valid: false, error: 'Invalid document' };
            }
            // Verify document belongs to the driver
            if (document.driverId !== data.driverId) {
                await this.logVerification({
                    documentId: data.documentId,
                    driverId: data.driverId,
                    result: client_1.VerificationResult.INVALID,
                    notes: 'Document does not belong to this driver'
                });
                return { valid: false, error: 'Document mismatch' };
            }
            // Check if document is expired
            if (document.expiryDate < new Date()) {
                await this.logVerification({
                    documentId: data.documentId,
                    driverId: data.driverId,
                    result: client_1.VerificationResult.EXPIRED,
                    notes: 'Document has expired'
                });
                return { valid: false, error: 'Document has expired' };
            }
            // Check if QR code is too old (e.g., 5 minutes)
            const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
            if (data.timestamp < fiveMinutesAgo) {
                await this.logVerification({
                    documentId: data.documentId,
                    driverId: data.driverId,
                    result: client_1.VerificationResult.EXPIRED,
                    notes: 'QR code has expired'
                });
                return { valid: false, error: 'QR code has expired' };
            }
            // Log successful verification
            await this.logVerification({
                documentId: data.documentId,
                driverId: data.driverId,
                result: client_1.VerificationResult.VALID,
                notes: 'Document verified successfully'
            });
            return {
                valid: true,
                document,
                driverId: data.driverId
            };
        }
        catch (error) {
            console.error('QR code verification error:', error);
            return {
                valid: false,
                error: error instanceof Error ? error.message : 'Invalid QR code'
            };
        }
    }
    // Log verification attempt
    async logVerification(data) {
        try {
            return await this.verificationLogRepo.create({
                documentId: data.documentId,
                driverId: data.driverId,
                officerId: data.officerId,
                result: data.result, // Cast to any to match Prisma enum
                notes: data.notes,
                location: data.location,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent
            });
        }
        catch (error) {
            console.error('Failed to log verification:', error);
            // Don't throw to avoid breaking the main flow
            return null;
        }
    }
}
exports.QRCodeService = QRCodeService;
