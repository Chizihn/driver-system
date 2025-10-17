// src/routes/qrcode.routes.ts
import { Router } from 'express';
import { QRCodeController } from '../controllers/qr.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import { roleMiddleware } from '../middleware/role.middleware';


const router = Router();
const qrCodeController = new QRCodeController();

// Driver gets their QR code
router.get(
  '/me/qrcode',
  authMiddleware,
  qrCodeController.getDriverQRCode
);

// Officer verifies a QR code
router.post(
  '/verify/qrcode',
  authMiddleware,
  roleMiddleware([UserRole.OFFICER]),
  qrCodeController.verifyQRCode
);

export default router;