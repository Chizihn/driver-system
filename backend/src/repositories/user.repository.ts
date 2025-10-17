// src/repositories/user.repository.ts
import { User, UserRole, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("user");
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.model.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  async findByBadgeNumber(badgeNumber: string): Promise<User | null> {
    return this.model.findUnique({
      where: { badgeNumber },
    });
  }

  async findActiveOfficers(): Promise<User[]> {
    return this.model.findMany({
      where: {
        role: UserRole.OFFICER,
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

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.model.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }
}
