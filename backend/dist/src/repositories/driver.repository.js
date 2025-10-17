"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRepository = void 0;
const base_repository_1 = require("./base.repository");
class DriverRepository extends base_repository_1.BaseRepository {
    constructor() {
        super("driver");
    }
    async findByQRCode(qrCode) {
        return this.model.findUnique({
            where: { qrCode },
            include: {
                documents: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }
    async findByPhoneNumber(phoneNumber) {
        return this.model.findFirst({
            where: { phoneNumber },
        });
    }
    async search(query) {
        return this.model.findMany({
            where: {
                OR: [
                    { firstName: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } },
                    { phoneNumber: { contains: query } },
                    { qrCode: { contains: query } },
                ],
            },
            include: {
                documents: {
                    take: 3,
                    orderBy: { createdAt: "desc" },
                },
            },
            take: 20,
        });
    }
    async findWithDocuments(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                documents: {
                    orderBy: { createdAt: "desc" },
                },
                verificationLogs: {
                    take: 10,
                    orderBy: { createdAt: "desc" },
                    include: {
                        officer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                badgeNumber: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
exports.DriverRepository = DriverRepository;
