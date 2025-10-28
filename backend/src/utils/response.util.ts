// src/utils/response.util.ts
import { Response } from "express";

export class ResponseUtil {
  static success(
    res: Response,
    message: string,
    data?: any,
    meta?: any,
    status = 200
  ) {
    res.status(status).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static error(res: Response, message = "Server error", status = 500) {
    res.status(status).json({
      success: false,
      message,
    });
  }

  // ADD THESE
  static notFound(res: Response, message = "Resource not found") {
    this.error(res, message, 404);
  }

  static badRequest(res: Response, message = "Bad request") {
    this.error(res, message, 400);
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message = "Forbidden") {
    this.error(res, message, 403);
  }

  static created(res: Response, message: string, data?: any, meta?: any) {
    this.success(res, message, data, meta, 201);
  }
}
