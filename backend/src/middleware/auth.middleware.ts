import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../types";
import { AuthService } from "../services/auth.service";
import { ResponseUtil } from "../utils/response.util";

export const authMiddleware: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ResponseUtil.error(res, "Access token required", 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const authService = new AuthService();
    const user = await authService.verifyToken(token);

    req.user = user;
    next();
  } catch (error: any) {
    return ResponseUtil.error(res, error.message || "Invalid token", 401);
  }
};
