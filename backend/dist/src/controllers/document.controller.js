"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const document_service_1 = require("../services/document.service");
const response_util_1 = require("../utils/response.util");
class DocumentController {
    constructor() {
        this.createDocument = async (req, res, next) => {
            try {
                const document = await this.documentService.createDocument(req.body);
                response_util_1.ResponseUtil.success(res, "Document created successfully", document, undefined, 201);
            }
            catch (error) {
                next(error);
            }
        };
        this.getDocumentById = async (req, res, next) => {
            try {
                const document = await this.documentService.getDocumentById(req.params.id);
                response_util_1.ResponseUtil.success(res, "Document retrieved successfully", document);
            }
            catch (error) {
                next(error);
            }
        };
        this.getDocumentByNumber = async (req, res, next) => {
            try {
                const document = await this.documentService.getDocumentByNumber(req.params.documentNumber);
                response_util_1.ResponseUtil.success(res, "Document retrieved successfully", document);
            }
            catch (error) {
                next(error);
            }
        };
        this.getDriverDocuments = async (req, res, next) => {
            try {
                const documents = await this.documentService.getDriverDocuments(req.params.driverId);
                response_util_1.ResponseUtil.success(res, "Documents retrieved successfully", documents);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateDocument = async (req, res, next) => {
            try {
                const document = await this.documentService.updateDocument(req.params.id, req.body);
                response_util_1.ResponseUtil.success(res, "Document updated successfully", document);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateDocumentStatus = async (req, res, next) => {
            try {
                const { status } = req.body;
                const document = await this.documentService.updateDocumentStatus(req.params.id, status);
                response_util_1.ResponseUtil.success(res, "Document status updated successfully", document);
            }
            catch (error) {
                next(error);
            }
        };
        this.getExpiringSoon = async (req, res, next) => {
            try {
                const days = parseInt(req.query.days) || 30;
                const documents = await this.documentService.getExpiringSoon(days);
                response_util_1.ResponseUtil.success(res, "Expiring documents retrieved successfully", documents);
            }
            catch (error) {
                next(error);
            }
        };
        this.documentService = new document_service_1.DocumentService();
    }
}
exports.DocumentController = DocumentController;
