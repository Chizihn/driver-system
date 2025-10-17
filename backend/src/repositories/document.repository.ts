// src/repositories/document.repository.ts
import { Document, DocumentStatus, DocumentType } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class DocumentRepository extends BaseRepository<Document> {
  constructor() {
    super("document");
  }

  async findByDocumentNumber(documentNumber: string): Promise<Document | null> {
    return this.model.findUnique({
      where: { documentNumber },
      include: {
        driver: true,
      },
    });
  }

  async findByQRCode(qrCode: string): Promise<Document | null> {
    return this.model.findUnique({
      where: { qrCode },
      include: {
        driver: true,
      },
    });
  }

  async findByDriverId(driverId: string): Promise<Document[]> {
    return this.model.findMany({
      where: { driverId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findExpiringSoon(days: number): Promise<Document[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.model.findMany({
      where: {
        expiryDate: {
          lte: futureDate,
          gte: new Date(),
        },
        status: DocumentStatus.VALID,
      },
      include: {
        driver: true,
      },
    });
  }

  async updateExpiredDocuments(): Promise<number> {
    const result = await this.model.updateMany({
      where: {
        expiryDate: {
          lt: new Date(),
        },
        status: DocumentStatus.VALID,
      },
      data: {
        status: DocumentStatus.EXPIRED,
      },
    });

    return result.count;
  }
}
