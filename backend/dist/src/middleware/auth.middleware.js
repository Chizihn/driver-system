"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_service_1 = require("../services/auth.service");
const response_util_1 = require("../utils/response.util");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return response_util_1.ResponseUtil.error(res, "Access token required", 401);
        }
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        const authService = new auth_service_1.AuthService();
        const user = await authService.verifyToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        return response_util_1.ResponseUtil.error(res, error.message || "Invalid token", 401);
    }
};
exports.authMiddleware = authMiddleware;
