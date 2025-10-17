"use strict";
// src/repositories/verification-log.repository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationLogRepository = void 0;
const client_1 = require("@prisma/client");
const base_repository_1 = require("./base.repository");
class VerificationLogRepository extends base_repository_1.BaseRepository {
    constructor() {
        super("verificationLog");
    }
    async findByOfficerId(officerId, limit = 50) {
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
    async findByDriverId(driverId) {
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
    async getStatsByOfficer(officerId, startDate, endDate) {
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
            valid: logs.filter((log) => log.result === client_1.VerificationResult.VALID).length,
            invalid: logs.filter((log) => log.result === client_1.VerificationResult.INVALID).length,
            expired: logs.filter((log) => log.result === client_1.VerificationResult.EXPIRED).length,
            forged: logs.filter((log) => log.result === client_1.VerificationResult.FORGED).length,
        };
    }
    async getSystemStats(startDate, endDate) {
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
                valid: logs.filter((log) => log.result === client_1.VerificationResult.VALID).length,
                invalid: logs.filter((log) => log.result === client_1.VerificationResult.INVALID).length,
                expired: logs.filter((log) => log.result === client_1.VerificationResult.EXPIRED).length,
                forged: logs.filter((log) => log.result === client_1.VerificationResult.FORGED).length,
            },
            topOfficers: this.getTopOfficers(logs),
        };
    }
    async countToday() {
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
    async countTodayByOfficer(officerId) {
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
    async findRecent(limit = 10) {
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
    getTopOfficers(logs) {
        const officerMap = new Map();
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
exports.VerificationLogRepository = VerificationLogRepository;
