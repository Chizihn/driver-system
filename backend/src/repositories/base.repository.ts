// src/repositories/base.repository.ts
import { PrismaClient } from "@prisma/client";
import { prisma } from "../config/database.config";
import { PaginationParams } from "../types";

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(modelName: string) {
    this.prisma = prisma;
    this.model = (prisma as any)[modelName];
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

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }
}
