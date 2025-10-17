"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const driver_repository_1 = require("../repositories/driver.repository");
class DriverService {
    constructor() {
        this.repo = new driver_repository_1.DriverRepository();
    }
    async createDriver(data) {
        return this.repo.create(data);
    }
    async getDriverById(id) {
        return this.repo.findWithDocuments(id);
    }
    async searchDrivers(query) {
        return this.repo.search(query || "");
    }
    async getAllDrivers(page, limit) {
        const drivers = await this.repo.findAll({ page, limit });
        const count = await this.repo.count();
        return { drivers, pagination: { page, limit, total: count } };
    }
    async updateDriver(id, data) {
        return this.repo.update(id, data);
    }
    async deactivateDriver(id) {
        return this.repo.update(id, { isActive: false });
    }
}
exports.DriverService = DriverService;
