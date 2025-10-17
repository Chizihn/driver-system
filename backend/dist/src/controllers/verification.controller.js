"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationController = void 0;
const verification_service_1 = require("../services/verification.service");
const response_util_1 = require("../utils/response.util");
class VerificationController {
    constructor() {
        this.verifyDriver = async (req, res, next) => {
            try {
                const result = await this.verificationService.verifyDriver(req.user.id, req.body, req.ip, req.get("user-agent"));
                response_util_1.ResponseUtil.success(res, "Verification completed", result);
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyByQRCode = async (req, res, next) => {
            try {
                const { qrCodeData, location, notes } = req.body;
                const result = await this.verificationService.verifyByQRCode(req.user.id, qrCodeData, location, notes, req.ip, req.get("user-agent"));
                response_util_1.ResponseUtil.success(res, "QR code verification completed", result);
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyByDocumentNumber = async (req, res, next) => {
            try {
                const { documentNumber, location, notes } = req.body;
                const result = await this.verificationService.verifyByDocumentNumber(req.user.id, documentNumber, location, notes, req.ip, req.get("user-agent"));
                response_util_1.ResponseUtil.success(res, "Document verification completed", result);
            }
            catch (error) {
                next(error);
            }
        };
        this.getVerificationHistory = async (req, res, next) => {
            try {
                const limit = parseInt(req.query.limit) || 50;
                const history = await this.verificationService.getVerificationHistory(req.user.id, limit);
                response_util_1.ResponseUtil.success(res, "Verification history retrieved", history);
            }
            catch (error) {
                next(error);
            }
        };
        this.getDriverVerificationHistory = async (req, res, next) => {
            try {
                const history = await this.verificationService.getDriverVerificationHistory(req.params.driverId);
                response_util_1.ResponseUtil.success(res, "Driver verification history retrieved", history);
            }
            catch (error) {
                next(error);
            }
        };
        this.getOfficerStats = async (req, res, next) => {
            try {
                const days = parseInt(req.query.days) || 30;
                const stats = await this.verificationService.getOfficerStats(req.user.id, days);
                response_util_1.ResponseUtil.success(res, "Officer statistics retrieved", stats);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSystemStats = async (req, res, next) => {
            try {
                const days = parseInt(req.query.days) || 30;
                const stats = await this.verificationService.getSystemStats(days);
                response_util_1.ResponseUtil.success(res, "System statistics retrieved", stats);
            }
            catch (error) {
                next(error);
            }
        };
        this.verificationService = new verification_service_1.VerificationService();
    }
}
exports.VerificationController = VerificationController;
