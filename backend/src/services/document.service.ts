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
}
