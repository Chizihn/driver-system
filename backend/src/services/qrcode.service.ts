// src/services/qrcode.service.ts
import qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { DocumentRepository } from '../repositories/document.repository';
import { VerificationLogRepository } from '../repositories/verification-log.repository';
import { VerificationResult } from '@prisma/client';

interface QRCodeData {
  documentId: string;
  driverId: string;
  timestamp: number;
  // Optional token for additional security if needed
  token?: string;
}

type DocumentWithMetadata = {
  id: string;
  driverId: string;
  type: string;
  documentNumber: string;
  issueDate: Date;
  expiryDate: Date;
  issuingAuthority: string;
  status: string;
  fileUrl: string | null;
  qrCode: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
};

export class QRCodeService {
  private docRepo: DocumentRepository;
  public verificationLogRepo: VerificationLogRepository;

  constructor() {
    this.docRepo = new DocumentRepository();
    this.verificationLogRepo = new VerificationLogRepository();
  }

  // Get driver's license document (treated as primary for verification)
  async getDriverPrimaryDocument(driverId: string) {
    const documents = await this.docRepo.findByDriverId(driverId);
    // Find the driver's license or first available document
    return documents.find(doc => doc.type === 'LICENSE') || documents[0] || null;
  }

  // Generate a new QR code for a driver's document
  async generateQRCode(driverId: string, documentId: string): Promise<string> {
    const qrData: QRCodeData = {
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
    
    return qrcode.toDataURL(JSON.stringify(qrData));
  }

  // Verify a scanned QR code
  async verifyQRCode(qrData: string) {
    try {
      const data: QRCodeData = JSON.parse(qrData);
      
      // Basic validation
      if (!data.documentId || !data.driverId) {
        throw new Error('Invalid QR code format');
      }

      // Get the document from database
      const document = await this.docRepo.findById(data.documentId) as DocumentWithMetadata | null;
      
      if (!document) {
        await this.logVerification({
          documentId: data.documentId,
          driverId: data.driverId,
          result: VerificationResult.INVALID,
          notes: 'Document not found'
        });
        return { valid: false, error: 'Invalid document' };
      }

      // Verify document belongs to the driver
      if (document.driverId !== data.driverId) {
        await this.logVerification({
          documentId: data.documentId,
          driverId: data.driverId,
          result: VerificationResult.INVALID,
          notes: 'Document does not belong to this driver'
        });
        return { valid: false, error: 'Document mismatch' };
      }

      // Check if document is expired
      if (document.expiryDate < new Date()) {
        await this.logVerification({
          documentId: data.documentId,
          driverId: data.driverId,
          result: VerificationResult.EXPIRED,
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
          result: VerificationResult.EXPIRED,
          notes: 'QR code has expired'
        });
        return { valid: false, error: 'QR code has expired' };
      }

      // Log successful verification
      await this.logVerification({
        documentId: data.documentId,
        driverId: data.driverId,
        result: VerificationResult.VALID,
        notes: 'Document verified successfully'
      });

      return { 
        valid: true, 
        document,
        driverId: data.driverId 
      };
    } catch (error) {
      console.error('QR code verification error:', error);
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Invalid QR code'
      };
    }
  }

  // Log verification attempt
  private async logVerification(data: {
    documentId: string;
    driverId: string;
    result: string;
    notes?: string;
    officerId?: string;
    location?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await this.verificationLogRepo.create({
        documentId: data.documentId,
        driverId: data.driverId,
        officerId: data.officerId,
        result: data.result as any, // Cast to any to match Prisma enum
        notes: data.notes,
        location: data.location,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      });
    } catch (error) {
      console.error('Failed to log verification:', error);
      // Don't throw to avoid breaking the main flow
      return null;
    }
  }
}