// src/repositories/document.repository.ts

import { Document } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class DocumentRepository extends BaseRepository<Document> {
  constructor() {
    super("document"); // matches `prisma.document`
  }

  // Your existing methods (they can stay or be removed if redundant)
  async findByDocumentNumber(documentNumber: string) {
    return this.findMany({
      where: { documentNumber },
      include: { driver: true },
    }).then((arr) => arr[0] ?? null);
  }

  async findByDriverId(driverId: string): Promise<Document[]> {
    return this.findMany({
      where: { driverId },
      orderBy: { createdAt: "desc" },
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

  async findExpiringSoon(days: number): Promise<Document[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.findMany({
      where: {
        expiryDate: {
          lte: futureDate,
          gte: new Date(),
        },
        status: "VALID",
      },
      include: { driver: true },
    });
  }

  // Optional: keep updateExpiredDocuments using updateMany
  async updateExpiredDocuments(): Promise<number> {
    const result = await this.model.updateMany({
      where: {
        expiryDate: { lt: new Date() },
        status: "VALID",
      },
      data: { status: "EXPIRED" },
    });
    return result.count;
  }
}
