"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_util_1 = require("../utils/response.util");
class AuthController {
    constructor() {
        this.login = async (req, res, next) => {
            try {
                const result = await this.authService.login(req.body);
                response_util_1.ResponseUtil.success(res, "Login successful", result);
            }
            catch (error) {
                next(error);
            }
        };
        this.register = async (req, res, next) => {
            try {
                const user = await this.authService.register(req.body);
                response_util_1.ResponseUtil.success(res, "User registered successfully", user, undefined, 201);
            }
            catch (error) {
                next(error);
            }
        };
        this.refreshToken = async (req, res, next) => {
            try {
                const { refreshToken } = req.body;
                const result = await this.authService.refreshToken(refreshToken);
                response_util_1.ResponseUtil.success(res, "Token refreshed successfully", result);
            }
            catch (error) {
                next(error);
            }
        };
        this.changePassword = async (req, res, next) => {
            try {
                const { currentPassword, newPassword } = req.body;
                const result = await this.authService.changePassword(req.user.id, currentPassword, newPassword);
                response_util_1.ResponseUtil.success(res, result.message);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfile = async (req, res, next) => {
            try {
                response_util_1.ResponseUtil.success(res, "Profile retrieved successfully", req.user);
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
