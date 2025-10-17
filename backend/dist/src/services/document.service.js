"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const document_repository_1 = require("../repositories/document.repository");
class DocumentService {
    constructor() {
        this.repo = new document_repository_1.DocumentRepository();
    }
    async createDocument(data) {
        return this.repo.create(data);
    }
    async getDocumentById(id) {
        return this.repo.findById(id);
    }
    async getDocumentByNumber(documentNumber) {
        return this.repo.findByDocumentNumber(documentNumber);
    }
    async getDriverDocuments(driverId) {
        return this.repo.findByDriverId(driverId);
    }
    async updateDocument(id, data) {
        return this.repo.update(id, data);
    }
    async updateDocumentStatus(id, status) {
        return this.repo.update(id, { status });
    }
    async getExpiringSoon(days) {
        return this.repo.findExpiringSoon(days);
    }
}
exports.DocumentService = DocumentService;
