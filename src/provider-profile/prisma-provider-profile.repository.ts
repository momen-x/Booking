import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { CreateProviderProfileDto } from "./dto/create-provider-profile.dto";
import { ProviderProfile } from "./entities/provider-profile.entity";
import { ProviderProfileRepository } from "./provider-profile.repository";
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
      throw new NotFoundException("User not found");
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
    await this.prisma.providerProfile.delete({
      where: { id },
    });
    return { message: "Provider profile deleted successfully" };
  }
  async updateProviderProfile(
    id: string,
    data: UpdateProviderProfileDto,
  ): Promise<ProviderProfile> {
    const updatedProviderProfile = await this.prisma.providerProfile.update({
      where: { id },
      data: { ...data },
    });
    return updatedProviderProfile;
  }
}
