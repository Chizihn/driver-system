"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const response_util_1 = require("../utils/response.util");
const client_1 = require("@prisma/client");
class DashboardController {
    constructor() {
        this.getDashboard = async (req, res, next) => {
            try {
                let dashboard;
                if (req.user.role === client_1.UserRole.ADMIN) {
                    dashboard = await this.dashboardService.getAdminDashboard();
                }
                else {
                    dashboard = await this.dashboardService.getOfficerDashboard(req.user.id);
                }
                response_util_1.ResponseUtil.success(res, "Dashboard data retrieved successfully", dashboard);
            }
            catch (error) {
                next(error);
            }
        };
        this.dashboardService = new dashboard_service_1.DashboardService();
    }
}
exports.DashboardController = DashboardController;
