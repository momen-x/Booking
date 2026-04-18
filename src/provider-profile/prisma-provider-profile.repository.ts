import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { CreateProviderProfileDto } from "./dto/create-provider-profile.dto";
import { ProviderProfile } from "./entities/provider-profile.entity";
import { ProviderProfileRepository } from "./provider-profile.repository";
import { BadRequestException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { UpdateProviderProfileDto } from "./dto/update-provider-profile.dto";

@Injectable()
export class PrismaProviderProfileRepository implements ProviderProfileRepository {
  constructor(private prisma: PrismaService) {}
  async createProvider(
    data: CreateProviderProfileDto,
  ): Promise<ProviderProfile> {
    const { userId, businessName, description, location } = data;
    const isExistUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!isExistUser) {
      throw new BadRequestException("User not found");
    }
    if (isExistUser.role === UserRole.PROVIDER) {
      throw new BadRequestException("User is already a provider");
    }
    if (isExistUser.role !== UserRole.ADMIN) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.PROVIDER },
      });
    }
    const createProviderProfile = {
      userId,
      businessName,
      description: description ?? null,
      location: location ?? null,
    };
    const providerProfile = await this.prisma.providerProfile.create({
      data: createProviderProfile,
    });
    return providerProfile;
  }
  getAllProviders(): Promise<ProviderProfile[]> {
    return this.prisma.providerProfile.findMany({
      include: { user: true, services: true, availability: true },
    }) as Promise<ProviderProfile[]>;
  }
  findById(id: string): Promise<ProviderProfile | null> {
    return this.prisma.providerProfile.findUnique({
      where: { id },
      include: { user: true, services: true, availability: true },
    }) as Promise<ProviderProfile | null>;
  }
  async deleteProvider(id: string): Promise<{ message: string }> {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { id },
    });
    if (!providerProfile) {
      throw new BadRequestException("Provider profile not found");
    }
    const user = await this.prisma.user.findUnique({
      where: { id: providerProfile.userId },
    });
    if (user?.role !== UserRole.ADMIN) {
      await this.prisma.user.update({
        where: { id: providerProfile.userId },
        data: { role: UserRole.USER },
      });
    }
    await this.prisma.providerProfile.delete({
      where: { id },
    });
    return { message: "Provider profile deleted successfully" };
  }
  async updateProviderProfile(
    id: string,
    userId: string,
    role: string,
    data: UpdateProviderProfileDto,
  ): Promise<ProviderProfile> {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { id },
    });
    if (!providerProfile) {
      throw new BadRequestException("Provider profile not found");
    }

    const isOwner = providerProfile.userId === userId;
    const isAdmin = role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new BadRequestException(
        "You are not authorized to update this provider profile",
      );
    }
    const updatedProviderProfile = await this.prisma.providerProfile.update({
      where: { id },
      data: { ...data },
    });
    return updatedProviderProfile;
  }
}
