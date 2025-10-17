import { Response } from "express";

export class ResponseUtil {
  static success(
    res: Response,
    message: string,
    data?: any,
    meta?: any,
    status = 200
  ) {
    res.status(status).json({ success: true, message, data, meta });
  }

  static error(res: Response, message = "Server error", status = 500) {
    res.status(status).json({ success: false, message });
  }
}
