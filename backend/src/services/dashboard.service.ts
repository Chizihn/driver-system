import { VerificationLogRepository } from "../repositories/verification-log.repository";
import { UserRepository } from "../repositories/user.repository";
import { DriverRepository } from "../repositories/driver.repository";
import { DocumentRepository } from "../repositories/document.repository";
import { DocumentStatus } from "@prisma/client";

export class DashboardService {
  private logRepo = new VerificationLogRepository();
  private userRepo = new UserRepository();
  private driverRepo = new DriverRepository();
  private documentRepo = new DocumentRepository();

  async getAdminDashboard() {
    const [
      totalDrivers,
      totalDocuments,
      validDocuments,
      expiredDocuments,
      totalVerifications,
      verificationsToday,
      recentVerifications,
    ] = await Promise.all([
      this.driverRepo.count({ isActive: true }),
      this.documentRepo.count(),
      this.documentRepo.count({ status: DocumentStatus.VALID }),
      this.documentRepo.count({ status: DocumentStatus.EXPIRED }),
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

  async getOfficerDashboard(officerId: string) {
    const [
      totalDrivers,
      totalDocuments,
      validDocuments,
      expiredDocuments,
      myVerifications,
      verificationsToday,
      recentVerifications,
    ] = await Promise.all([
      this.driverRepo.count({ isActive: true }),
      this.documentRepo.count(),
      this.documentRepo.count({ status: DocumentStatus.VALID }),
      this.documentRepo.count({ status: DocumentStatus.EXPIRED }),
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
