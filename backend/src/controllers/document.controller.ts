// src/controllers/document.controller.ts
import { Response, NextFunction } from "express";
import { DocumentService } from "../services/document.service";
import { AuthenticatedRequest } from "../types";
import { ResponseUtil } from "../utils/response.util";

export class DocumentController {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  createDocument = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const document = await this.documentService.createDocument(req.body);
      ResponseUtil.success(
        res,
        "Document created successfully",
        document,
        undefined,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getDocumentById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const document = await this.documentService.getDocumentById(
        req.params.id
      );
      ResponseUtil.success(res, "Document retrieved successfully", document);
    } catch (error) {
      next(error);
    }
  };

  getDocumentByNumber = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const document = await this.documentService.getDocumentByNumber(
        req.params.documentNumber
      );
      ResponseUtil.success(res, "Document retrieved successfully", document);
    } catch (error) {
      next(error);
    }
  };

  getDriverDocuments = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const documents = await this.documentService.getDriverDocuments(
        req.params.driverId
      );
      ResponseUtil.success(res, "Documents retrieved successfully", documents);
    } catch (error) {
      next(error);
    }
  };

  updateDocument = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const document = await this.documentService.updateDocument(
        req.params.id,
        req.body
      );
      ResponseUtil.success(res, "Document updated successfully", document);
    } catch (error) {
      next(error);
    }
  };

  updateDocumentStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { status } = req.body;
      const document = await this.documentService.updateDocumentStatus(
        req.params.id,
        status
      );
      ResponseUtil.success(
        res,
        "Document status updated successfully",
        document
      );
    } catch (error) {
      next(error);
    }
  };

  getExpiringSoon = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const documents = await this.documentService.getExpiringSoon(days);
      ResponseUtil.success(
        res,
        "Expiring documents retrieved successfully",
        documents
      );
    } catch (error) {
      next(error);
    }
  };
}
