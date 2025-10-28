// src/repositories/driver.repository.ts
import { Driver, Prisma, Document } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export type DriverWithDocuments = Driver & {
  documents: Document[];
};

export class DriverRepository extends BaseRepository<Driver> {
  constructor() {
    super("driver");
  }

  async findByQRCode(qrCode: string): Promise<DriverWithDocuments | null> {
    return this.model.findUnique({
      where: { qrCode },
      include: {
        documents: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Driver | null> {
    return this.model.findFirst({
      where: { phoneNumber },
    });
  }

  async search(query: string): Promise<Driver[]> {
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

  async findByPhoneAndDOB(phoneNumber: string, dateOfBirth: string) {
    return this.model.findFirst({
      where: {
        phoneNumber,
        dateOfBirth: {
          equals: new Date(dateOfBirth),
        },
      },
      include: {
        documents: {
          where: { type: 'LICENSE' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
    });
  }

  async findWithDocuments(id: string) {
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
