"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const database_config_1 = require("../config/database.config");
class BaseRepository {
    constructor(modelName) {
        this.prisma = database_config_1.prisma;
        this.model = database_config_1.prisma[modelName];
    }
    async findById(id) {
        return this.model.findUnique({ where: { id } });
    }
    async findAll(params) {
        const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", } = params || {};
        return this.model.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        });
    }
    async create(data) {
        return this.model.create({ data });
    }
    async update(id, data) {
        return this.model.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.model.delete({ where: { id } });
    }
    async count(where) {
        return this.model.count({ where });
    }
}
exports.BaseRepository = BaseRepository;
