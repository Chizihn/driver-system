import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { ErrorUtil } from "../utils/error.util";
import { User } from "@prisma/client";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  badgeNumber?: string;
}

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async login(data: LoginData) {
    const { username, password } = data;

    // Find user by username
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      throw new ErrorUtil("Invalid credentials", 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ErrorUtil("Account is deactivated", 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorUtil("Invalid credentials", 401);
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

  async register(data: RegisterData) {
    const { username, email, password, firstName, lastName, badgeNumber } =
      data;

    // Check if user already exists
    const existingUser = await this.userRepo.findByUsername(username);
    if (existingUser) {
      throw new ErrorUtil("Username already exists", 400);
    }

    const existingEmail = await this.userRepo.findByEmail(email);
    if (existingEmail) {
      throw new ErrorUtil("Email already exists", 400);
    }

    if (badgeNumber) {
      const existingBadge = await this.userRepo.findByBadgeNumber(badgeNumber);
      if (existingBadge) {
        throw new ErrorUtil("Badge number already exists", 400);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

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

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as any;

      const user = await this.userRepo.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new ErrorUtil("Invalid refresh token", 401);
      }

      const newAccessToken = this.generateAccessToken(user);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new ErrorUtil("Invalid refresh token", 401);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new ErrorUtil("User not found", 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new ErrorUtil("Current password is incorrect", 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await this.userRepo.updatePassword(userId, hashedNewPassword);

    return { message: "Password updated successfully" };
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const user = await this.userRepo.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new ErrorUtil("Invalid token", 401);
      }

      return user;
    } catch (error) {
      throw new ErrorUtil("Invalid token", 401);
    }
  }

  private generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }
}
