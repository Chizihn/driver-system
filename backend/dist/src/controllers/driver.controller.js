"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const driver_service_1 = require("../services/driver.service");
const response_util_1 = require("../utils/response.util");
class DriverController {
    constructor() {
        this.createDriver = async (req, res, next) => {
            try {
                const driver = await this.driverService.createDriver(req.body);
                response_util_1.ResponseUtil.success(res, "Driver created successfully", driver, undefined, 201);
            }
            catch (error) {
                next(error);
            }
        };
        this.getDriverById = async (req, res, next) => {
            try {
                const driver = await this.driverService.getDriverById(req.params.id);
                response_util_1.ResponseUtil.success(res, "Driver retrieved successfully", driver);
            }
            catch (error) {
                next(error);
            }
        };
        this.searchDrivers = async (req, res, next) => {
            try {
                const { q } = req.query;
                const drivers = await this.driverService.searchDrivers(q);
                response_util_1.ResponseUtil.success(res, "Search completed successfully", drivers);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllDrivers = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const result = await this.driverService.getAllDrivers(page, limit);
                response_util_1.ResponseUtil.success(res, "Drivers retrieved successfully", result.drivers, result.pagination);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateDriver = async (req, res, next) => {
            try {
                const driver = await this.driverService.updateDriver(req.params.id, req.body);
                response_util_1.ResponseUtil.success(res, "Driver updated successfully", driver);
            }
            catch (error) {
                next(error);
            }
        };
        this.deactivateDriver = async (req, res, next) => {
            try {
                const driver = await this.driverService.deactivateDriver(req.params.id);
                response_util_1.ResponseUtil.success(res, "Driver deactivated successfully", driver);
            }
            catch (error) {
                next(error);
            }
        };
        this.driverService = new driver_service_1.DriverService();
    }
}
exports.DriverController = DriverController;
