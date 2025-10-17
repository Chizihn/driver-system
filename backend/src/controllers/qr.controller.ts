// src/controllers/qrcode.controller.ts
import { Response, NextFunction } from 'express';
import { QRCodeService } from '../services/qrcode.service';
import { AuthenticatedRequest } from '../types';
import { ResponseUtil } from '../utils/response.util';
import { VerificationResult } from '@prisma/client';

export class QRCodeController {
  private qrCodeService: QRCodeService;

  constructor() {
    this.qrCodeService = new QRCodeService();
  }

  // For drivers to get their QR code
  getDriverQRCode = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const driverId = req.user!.id;
      const document = await this.qrCodeService.getDriverPrimaryDocument(driverId);
      
      if (!document) {
        return ResponseUtil.error(res, 'No primary document found for this driver', 404);
      }

      const qrCodeDataURL = await this.qrCodeService.generateQRCode(driverId, document.id);
      return ResponseUtil.success(res, 'QR code generated', { qrCodeDataURL });
    } catch (error) {
      next(error);
    }
  };

  // For officers to verify a scanned QR code
  verifyQRCode = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { qrCodeData, location, notes } = req.body;
      const officerId = req.user!.id;
      
      if (!qrCodeData) {
        return ResponseUtil.error(res, 'QR code data is required', 400);
      }
      
      const verification = await this.qrCodeService.verifyQRCode(qrCodeData);
      
      if (!verification.valid) {
        return ResponseUtil.error(res, verification.error, 400);
      }

      if (!verification.document) {
        return ResponseUtil.error(res, 'Document information not found', 404);
      }

      // Log the verification using the repository directly
      const log = await this.qrCodeService.verificationLogRepo.create({
        officerId,
        driverId: verification.driverId,
        documentId: verification.document.id,
        result: 'VALID',
        location: location || '',
        notes: notes || '',
        ipAddress: req.ip || '',
        userAgent: req.get('user-agent') || ''
      });

      return ResponseUtil.success(res, 'Verification successful', {
        valid: true,
        document: verification.document,
        verificationLog: log
      });
    } catch (error) {
      console.error('QR code verification error:', error);
      next(error);
    }
  };
}