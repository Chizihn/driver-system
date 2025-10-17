// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../types";
import { ResponseUtil } from "../utils/response.util";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      ResponseUtil.success(res, "Login successful", result);
    } catch (error) {
      next(error);
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      ResponseUtil.success(
        res,
        "User registered successfully",
        user,
        undefined,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      ResponseUtil.success(res, "Token refreshed successfully", result);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await this.authService.changePassword(
        req.user!.id,
        currentPassword,
        newPassword
      );
      ResponseUtil.success(res, result.message);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      ResponseUtil.success(res, "Profile retrieved successfully", req.user);
    } catch (error) {
      next(error);
    }
  };
}
