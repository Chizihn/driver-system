// src/repositories/base.repository.ts
import { PrismaClient } from "@prisma/client";
import { PaginationParams } from "../types";

export abstract class BaseRepository<T> {
  protected model: any;
  protected prisma: PrismaClient;

  constructor(modelName: string) {
    this.prisma = new PrismaClient();
    this.model = (this.prisma as any)[modelName];
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(params?: PaginationParams): Promise<T[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {};

    return this.model.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async update(id: string, data: any): Promise<T | null> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }

  // ADD THIS METHOD
  async findMany(options?: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    return this.model.findMany(options);
  }

  // Optional: count
  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }
}
