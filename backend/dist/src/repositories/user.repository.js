"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
// src/repositories/user.repository.ts
const client_1 = require("@prisma/client");
const base_repository_1 = require("./base.repository");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super("user");
    }
    async findByUsername(username) {
        return this.model.findUnique({
            where: { username },
        });
    }
    async findByEmail(email) {
        return this.model.findUnique({
            where: { email },
        });
    }
    async findByBadgeNumber(badgeNumber) {
        return this.model.findUnique({
            where: { badgeNumber },
        });
    }
    async findActiveOfficers() {
        return this.model.findMany({
            where: {
                role: client_1.UserRole.OFFICER,
                isActive: true,
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                badgeNumber: true,
                createdAt: true,
            },
        });
    }
    async updatePassword(id, hashedPassword) {
        return this.model.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
}
exports.UserRepository = UserRepository;
