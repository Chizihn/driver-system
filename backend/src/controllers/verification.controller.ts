  // src/controllers/verification.controller.ts
  import { Response, NextFunction } from "express";
  import { VerificationService } from "../services/verification.service";
  import { AuthenticatedRequest } from "../types";
  import { ResponseUtil } from "../utils/response.util";

  export class VerificationController {
    private verificationService: VerificationService;

    constructor() {
      this.verificationService = new VerificationService();
    }

    verifyDriver = async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const result = await this.verificationService.verifyDriver(
          req.user!.id,
          req.body,
          req.ip,
          req.get("user-agent")
        );
        ResponseUtil.success(res, "Verification completed", result);
      } catch (error) {
        next(error);
      }
    };

    verifyByQRCode = async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { qrCodeData, location, notes } = req.body;
        const result = await this.verificationService.verifyByQRCode(
          req.user!.id,
          qrCodeData,
          location,
          notes,
          req.ip,
          req.get("user-agent")
        );
        ResponseUtil.success(res, "QR code verification completed", result);
      } catch (error) {
        next(error);
      }
    };

    verifyByDocumentNumber = async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { documentNumber, location, notes } = req.body;
        const result = await this.verificationService.verifyByDocumentNumber(
          req.user!.id,
          documentNumber,
          location,
          notes,
          req.ip,
          req.get("user-agent")
        );
        ResponseUtil.success(res, "Document verification completed", result);
      } catch (error) {
        next(error);
      }
    };

    getVerificationHistory = async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const limit = parseInt(req.query.limit as string) || 50;
        const history = await this.verificationService.getVerificationHistory(
          req.user!.id,
          limit
        );
        ResponseUtil.success(res, "Verification history retrieved", history);
      } catch (error) {
        next(error);
      }
    };

    getDriverVerificationHistory = async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const history =
          await this.verificationService.getDriverVerificationHistory(
            req.params.driverId
          );
        ResponseUtil.success(
          res,
          "Driver verification history retrieved",
          history
        );
      } catch (error) {
        next(error);
      }
    };

    getOfficerStats = async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const days = parseInt(req.query.days as string) || 30;
        const stats = await this.verificationService.getOfficerStats(
          req.user!.id,
          days
        );
        ResponseUtil.success(res, "Officer statistics retrieved", stats);
      } catch (error) {
        next(error);
      }
    };

    getSystemStats = async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const days = parseInt(req.query.days as string) || 30;
        const stats = await this.verificationService.getSystemStats(days);
        ResponseUtil.success(res, "System statistics retrieved", stats);
      } catch (error) {
        next(error);
      }
    };
  }
