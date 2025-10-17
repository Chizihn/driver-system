import { DriverRepository } from "../repositories/driver.repository";

export class DriverService {
  private repo: DriverRepository;

  constructor() {
    this.repo = new DriverRepository();
  }

  async createDriver(data: any) {
    return this.repo.create(data);
  }

  async getDriverById(id: string) {
    return this.repo.findWithDocuments(id);
  }

  async searchDrivers(query: string) {
    return this.repo.search(query || "");
  }

  async getAllDrivers(page: number, limit: number) {
    const drivers = await this.repo.findAll({ page, limit });
    const count = await this.repo.count();
    return { drivers, pagination: { page, limit, total: count } };
  }

  async updateDriver(id: string, data: any) {
    return this.repo.update(id, data);
  }

  async deactivateDriver(id: string) {
    return this.repo.update(id, { isActive: false });
  }
}
