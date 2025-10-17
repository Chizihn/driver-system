"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepository = void 0;
// src/repositories/document.repository.ts
const client_1 = require("@prisma/client");
const base_repository_1 = require("./base.repository");
class DocumentRepository extends base_repository_1.BaseRepository {
    constructor() {
        super("document");
    }
    async findByDocumentNumber(documentNumber) {
        return this.model.findUnique({
            where: { documentNumber },
            include: {
                driver: true,
            },
        });
    }
    async findByQRCode(qrCode) {
        return this.model.findUnique({
            where: { qrCode },
            include: {
                driver: true,
            },
        });
    }
    async findByDriverId(driverId) {
        return this.model.findMany({
            where: { driverId },
            orderBy: { createdAt: "desc" },
        });
    }
    async findExpiringSoon(days) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        return this.model.findMany({
            where: {
                expiryDate: {
                    lte: futureDate,
                    gte: new Date(),
                },
                status: client_1.DocumentStatus.VALID,
            },
            include: {
                driver: true,
            },
        });
    }
    async updateExpiredDocuments() {
        const result = await this.model.updateMany({
            where: {
                expiryDate: {
                    lt: new Date(),
                },
                status: client_1.DocumentStatus.VALID,
            },
            data: {
                status: client_1.DocumentStatus.EXPIRED,
            },
        });
        return result.count;
    }
}
exports.DocumentRepository = DocumentRepository;
