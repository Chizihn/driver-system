// src/controllers/dashboard.controller.ts
import { Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";
import { AuthenticatedRequest } from "../types";
import { ResponseUtil } from "../utils/response.util";
import { UserRole } from "@prisma/client";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getDashboard = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let dashboard;

      if (req.user!.role === UserRole.ADMIN) {
        dashboard = await this.dashboardService.getAdminDashboard();
      } else {
        dashboard = await this.dashboardService.getOfficerDashboard(
          req.user!.id
        );
      }

      ResponseUtil.success(
        res,
        "Dashboard data retrieved successfully",
        dashboard
      );
    } catch (error) {
      next(error);
    }
  };
}
