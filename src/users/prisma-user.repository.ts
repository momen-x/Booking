import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { UserRepository } from "./user.repository";
import { User as user, UserRole } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
  async updateUserName(id: string, username: string): Promise<user> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { username },
    });
    return updatedUser;
  }
  async updatePassword(id: string, password: string): Promise<user> {
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
  async deleteUser(id: string): Promise<user> {
    const deleteAccount = await this.prisma.user.delete({
      where: { id },
    });
    return deleteAccount;
  }
  async updateUserRole(id: string, role: UserRole) {
    const updateUserRole = await this.prisma.user.update({
      where: { id },
      data: { role },
    });
    return updateUserRole;
  }
}
