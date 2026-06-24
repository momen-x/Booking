import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { UserRepository } from "./user.repository";
import { User } from "./entities/user.entity";
import { UserRole } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
  async updateUserName(id: string, username: string): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { username },
    });
    return updatedUser;
  }
  async updatePassword(id: string, password: string): Promise<User> {
    const updateUserPass = await this.prisma.user.update({
      where: { id },
      data: { password },
    });
    return updateUserPass;
  }
  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    }) as Promise<User | null>;
  }
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<User | null>;
  }
  getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany() as Promise<User[]>;
  }
  async deleteUser(id: string): Promise<User> {
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
  async uploadUserImage(id: string, image: string) {
    const updateUserImage = await this.prisma.user.update({
      where: { id },
      data: { userImage: image },
    });
    return updateUserImage;
  }
  async deleteUserImage(id: string) {
    const updateUserImage = await this.prisma.user.update({
      where: { id },
      data: { userImage: null },
    });
    return updateUserImage;
  }
}
