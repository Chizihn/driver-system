// src/repositories/verification-log.repository.ts

import { VerificationLog, VerificationResult } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class VerificationLogRepository extends BaseRepository<VerificationLog> {
  constructor() {
    super("verificationLog");
  }

  async findByOfficerId(
    officerId: string,
    limit = 50
  ): Promise<VerificationLog[]> {
    return this.model.findMany({
      where: { officerId },
      include: {
        driver: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        document: {
          select: {
            type: true,
            documentNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async findByDriverId(driverId: string): Promise<VerificationLog[]> {
    return this.model.findMany({
      where: { driverId },
      include: {
        officer: {
          select: {
            firstName: true,
            lastName: true,
            badgeNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getStatsByOfficer(officerId: string, startDate: Date, endDate: Date) {
    const logs = await this.model.findMany({
      where: {
        officerId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      total: logs.length,
      valid: logs.filter(
        (log: VerificationLog) => log.result === VerificationResult.VALID
      ).length,
      invalid: logs.filter(
        (log: VerificationLog) => log.result === VerificationResult.INVALID
      ).length,
      expired: logs.filter(
        (log: VerificationLog) => log.result === VerificationResult.EXPIRED
      ).length,
      forged: logs.filter(
        (log: VerificationLog) => log.result === VerificationResult.FORGED
      ).length,
    };
  }

  async getSystemStats(startDate: Date, endDate: Date) {
    const logs = await this.model.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        officer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      total: logs.length,
      byResult: {
        valid: logs.filter(
          (log: VerificationLog) => log.result === VerificationResult.VALID
        ).length,
        invalid: logs.filter(
          (log: VerificationLog) => log.result === VerificationResult.INVALID
        ).length,
        expired: logs.filter(
          (log: VerificationLog) => log.result === VerificationResult.EXPIRED
        ).length,
        forged: logs.filter(
          (log: VerificationLog) => log.result === VerificationResult.FORGED
        ).length,
      },
      topOfficers: this.getTopOfficers(logs),
    };
  }

  async countToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.model.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }

  async countTodayByOfficer(officerId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.model.count({
      where: {
        officerId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }

  async findRecent(limit = 10): Promise<VerificationLog[]> {
    return this.model.findMany({
      include: {
        driver: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        officer: {
          select: {
            firstName: true,
            lastName: true,
            badgeNumber: true,
          },
        },
        document: {
          select: {
            type: true,
            documentNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  private getTopOfficers(
    logs: Array<
      VerificationLog & { officer?: { firstName: string; lastName: string } }
    >
  ) {
    const officerMap = new Map<string, { name: string; count: number }>();

    logs.forEach((log) => {
      const key = log.officerId;
      if (key) {
        const name = log.officer
          ? `${log.officer.firstName} ${log.officer.lastName}`.trim()
          : "Unknown Officer";
        const current = officerMap.get(key) || { name, count: 0 };
        officerMap.set(key, { name, count: current.count + 1 });
      }
    });

    return Array.from(officerMap.entries())
      .map(([id, { name, count }]) => ({
        id,
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }
}
