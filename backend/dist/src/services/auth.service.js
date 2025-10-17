"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const error_util_1 = require("../utils/error.util");
class AuthService {
    constructor() {
        this.userRepo = new user_repository_1.UserRepository();
    }
    async login(data) {
        const { username, password } = data;
        // Find user by username
        const user = await this.userRepo.findByUsername(username);
        if (!user) {
            throw new error_util_1.ErrorUtil("Invalid credentials", 401);
        }
        // Check if user is active
        if (!user.isActive) {
            throw new error_util_1.ErrorUtil("Account is deactivated", 401);
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new error_util_1.ErrorUtil("Invalid credentials", 401);
        }
        // Generate tokens
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }
    async register(data) {
        const { username, email, password, firstName, lastName, badgeNumber } = data;
        // Check if user already exists
        const existingUser = await this.userRepo.findByUsername(username);
        if (existingUser) {
            throw new error_util_1.ErrorUtil("Username already exists", 400);
        }
        const existingEmail = await this.userRepo.findByEmail(email);
        if (existingEmail) {
            throw new error_util_1.ErrorUtil("Email already exists", 400);
        }
        if (badgeNumber) {
            const existingBadge = await this.userRepo.findByBadgeNumber(badgeNumber);
            if (existingBadge) {
                throw new error_util_1.ErrorUtil("Badge number already exists", 400);
            }
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create user
        const user = await this.userRepo.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            badgeNumber,
        });
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await this.userRepo.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw new error_util_1.ErrorUtil("Invalid refresh token", 401);
            }
            const newAccessToken = this.generateAccessToken(user);
            return {
                accessToken: newAccessToken,
            };
        }
        catch (error) {
            throw new error_util_1.ErrorUtil("Invalid refresh token", 401);
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new error_util_1.ErrorUtil("User not found", 404);
        }
        // Verify current password
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new error_util_1.ErrorUtil("Current password is incorrect", 400);
        }
        // Hash new password
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
        // Update password
        await this.userRepo.updatePassword(userId, hashedNewPassword);
        return { message: "Password updated successfully" };
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await this.userRepo.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw new error_util_1.ErrorUtil("Invalid token", 401);
            }
            return user;
        }
        catch (error) {
            throw new error_util_1.ErrorUtil("Invalid token", 401);
        }
    }
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({
            userId: user.id,
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
    }
    generateRefreshToken(user) {
        return jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });
    }
}
exports.AuthService = AuthService;
