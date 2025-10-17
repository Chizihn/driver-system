"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/qrcode.routes.ts
const express_1 = require("express");
const qr_controller_1 = require("../controllers/qr.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
const qrCodeController = new qr_controller_1.QRCodeController();
// Driver gets their QR code
router.get('/me/qrcode', auth_middleware_1.authMiddleware, qrCodeController.getDriverQRCode);
// Officer verifies a QR code
router.post('/verify/qrcode', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)([client_1.UserRole.OFFICER]), qrCodeController.verifyQRCode);
exports.default = router;
