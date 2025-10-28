// src/services/document.service.ts

import { DocumentRepository } from "../repositories/document.repository";

export class DocumentService {
  private repo: DocumentRepository;

  constructor() {
    this.repo = new DocumentRepository();
  }

  async createDocument(data: any) {
    return this.repo.create(data);
  }

  async getDocumentById(id: string) {
    return this.repo.findById(id);
  }

  async getDocumentByNumber(documentNumber: string) {
    return this.repo.findByDocumentNumber(documentNumber);
  }

  async getDriverDocuments(driverId: string) {
    return this.repo.findByDriverId(driverId);
  }

  async updateDocument(id: string, data: any) {
    return this.repo.update(id, data);
  }

  async updateDocumentStatus(id: string, status: string) {
    return this.repo.update(id, { status });
  }

  async getExpiringSoon(days: number) {
    return this.repo.findExpiringSoon(days);
  }

  // Add this method
  async getAllDocuments(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { documentNumber: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
        { driver: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    return this.repo.findMany({
      where,
      include: { driver: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
