"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeController = void 0;
const qrcode_service_1 = require("../services/qrcode.service");
const response_util_1 = require("../utils/response.util");
class QRCodeController {
    constructor() {
        // For drivers to get their QR code
        this.getDriverQRCode = async (req, res, next) => {
            try {
                const driverId = req.user.id;
                const document = await this.qrCodeService.getDriverPrimaryDocument(driverId);
                if (!document) {
                    return response_util_1.ResponseUtil.error(res, 'No primary document found for this driver', 404);
                }
                const qrCodeDataURL = await this.qrCodeService.generateQRCode(driverId, document.id);
                return response_util_1.ResponseUtil.success(res, 'QR code generated', { qrCodeDataURL });
            }
            catch (error) {
                next(error);
            }
        };
        // For officers to verify a scanned QR code
        this.verifyQRCode = async (req, res, next) => {
            try {
                const { qrCodeData, location, notes } = req.body;
                const officerId = req.user.id;
                if (!qrCodeData) {
                    return response_util_1.ResponseUtil.error(res, 'QR code data is required', 400);
                }
                const verification = await this.qrCodeService.verifyQRCode(qrCodeData);
                if (!verification.valid) {
                    return response_util_1.ResponseUtil.error(res, verification.error, 400);
                }
                if (!verification.document) {
                    return response_util_1.ResponseUtil.error(res, 'Document information not found', 404);
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
                return response_util_1.ResponseUtil.success(res, 'Verification successful', {
                    valid: true,
                    document: verification.document,
                    verificationLog: log
                });
            }
            catch (error) {
                console.error('QR code verification error:', error);
                next(error);
            }
        };
        this.qrCodeService = new qrcode_service_1.QRCodeService();
    }
}
exports.QRCodeController = QRCodeController;
