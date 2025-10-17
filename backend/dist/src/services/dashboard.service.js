"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const verification_log_repository_1 = require("../repositories/verification-log.repository");
const user_repository_1 = require("../repositories/user.repository");
const driver_repository_1 = require("../repositories/driver.repository");
const document_repository_1 = require("../repositories/document.repository");
const client_1 = require("@prisma/client");
class DashboardService {
    constructor() {
        this.logRepo = new verification_log_repository_1.VerificationLogRepository();
        this.userRepo = new user_repository_1.UserRepository();
        this.driverRepo = new driver_repository_1.DriverRepository();
        this.documentRepo = new document_repository_1.DocumentRepository();
    }
    async getAdminDashboard() {
        const [totalDrivers, totalDocuments, validDocuments, expiredDocuments, totalVerifications, verificationsToday, recentVerifications,] = await Promise.all([
            this.driverRepo.count({ isActive: true }),
            this.documentRepo.count(),
            this.documentRepo.count({ status: client_1.DocumentStatus.VALID }),
            this.documentRepo.count({ status: client_1.DocumentStatus.EXPIRED }),
            this.logRepo.count(),
            this.logRepo.countToday(),
            this.logRepo.findRecent(10),
        ]);
        return {
            totalDrivers,
            totalDocuments,
            validDocuments,
            expiredDocuments,
            totalVerifications,
            verificationsToday,
            recentVerifications,
        };
    }
    async getOfficerDashboard(officerId) {
        const [totalDrivers, totalDocuments, validDocuments, expiredDocuments, myVerifications, verificationsToday, recentVerifications,] = await Promise.all([
            this.driverRepo.count({ isActive: true }),
            this.documentRepo.count(),
            this.documentRepo.count({ status: client_1.DocumentStatus.VALID }),
            this.documentRepo.count({ status: client_1.DocumentStatus.EXPIRED }),
            this.logRepo.count({ officerId }),
            this.logRepo.countTodayByOfficer(officerId),
            this.logRepo.findByOfficerId(officerId, 10),
        ]);
        return {
            totalDrivers,
            totalDocuments,
            validDocuments,
            expiredDocuments,
            totalVerifications: myVerifications,
            verificationsToday,
            recentVerifications,
        };
    }
}
exports.DashboardService = DashboardService;
