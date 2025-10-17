// src/controllers/driver.controller.ts
import { Response, NextFunction } from "express";
import { DriverService } from "../services/driver.service";
import { AuthenticatedRequest } from "../types";
import { ResponseUtil } from "../utils/response.util";

export class DriverController {
  private driverService: DriverService;

  constructor() {
    this.driverService = new DriverService();
  }

  createDriver = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const driver = await this.driverService.createDriver(req.body);
      ResponseUtil.success(
        res,
        "Driver created successfully",
        driver,
        undefined,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getDriverById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const driver = await this.driverService.getDriverById(req.params.id);
      ResponseUtil.success(res, "Driver retrieved successfully", driver);
    } catch (error) {
      next(error);
    }
  };

  searchDrivers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { q } = req.query;
      const drivers = await this.driverService.searchDrivers(q as string);
      ResponseUtil.success(res, "Search completed successfully", drivers);
    } catch (error) {
      next(error);
    }
  };

  getAllDrivers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.driverService.getAllDrivers(page, limit);
      ResponseUtil.success(
        res,
        "Drivers retrieved successfully",
        result.drivers,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  };

  updateDriver = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const driver = await this.driverService.updateDriver(
        req.params.id,
        req.body
      );
      ResponseUtil.success(res, "Driver updated successfully", driver);
    } catch (error) {
      next(error);
    }
  };

  deactivateDriver = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const driver = await this.driverService.deactivateDriver(req.params.id);
      ResponseUtil.success(res, "Driver deactivated successfully", driver);
    } catch (error) {
      next(error);
    }
  };
}
