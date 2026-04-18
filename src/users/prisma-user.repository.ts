import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { UserRepository } from "./user.repository";
import { User as user } from "./entities/user.entity";
import { UserRole } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
  async updateUserName(id: string, username: string): Promise<user> {
    const isExistUser = await this.prisma.user.findUnique({ where: { id } });
    if (!isExistUser) throw new BadRequestException("User not found");
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { username },
    });
    return updatedUser;
  }
  async updatePassword(id: string, password: string): Promise<user> {
    const isExistUser = await this.prisma.user.findUnique({ where: { id } });
    if (!isExistUser) throw new BadRequestException("User not found");
    const updateUserPass = await this.prisma.user.update({
      where: { id },
      data: { password },
    });
    return updateUserPass;
  }
  findById(id: string): Promise<user | null> {
    return this.prisma.user.findUnique({
      where: { id },
    }) as Promise<user | null>;
  }
  findByEmail(email: string): Promise<user | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<user | null>;
  }
  getAllUsers(): Promise<user[]> {
    return this.prisma.user.findMany() as Promise<user[]>;
  }
  async deleteUser(id: string): Promise<{ message: string }> {
    const isExistUser = await this.prisma.user.findUnique({ where: { id } });
    if (!isExistUser) throw new BadRequestException("User not found");
    if (isExistUser.role === UserRole.ADMIN)
      throw new BadRequestException("Cannot delete an admin user");
    await this.prisma.user.delete({
      where: { id },
    });
    return { message: "User deleted successfully" };
  }
  async getCurrentUser(id: string): Promise<user | null> {
    const isExistUser = await this.prisma.user.findUnique({
      where: { id },
    });
    return isExistUser as user | null;
  }
}
