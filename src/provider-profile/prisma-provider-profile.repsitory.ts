import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { CreateProviderProfileDto } from "./dto/create-provider-profile.dto";
import { ProviderProfile } from "./entities/provider-profile.entity";
import { ProviderProfileRepository } from "./provider-profile.repository";
import { BadRequestException } from "@nestjs/common";
import { UserRole } from "@prisma/client";

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
    const createProviderProfile = {
      userId,
      businessName,
      description: description ?? null,
      location: location ?? null,
    };
    const providerProfile = await this.prisma.providerProfile.create({
      data: createProviderProfile,
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.PROVIDER },
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
  deleteProvider(id: string): Promise<{ message: string }> {
    return this.prisma.providerProfile
      .delete({
        where: { id },
      })
      .then(() => ({ message: "Provider profile deleted successfully" }))
      .catch(() => {
        throw new BadRequestException("Provider profile not found");
      });
  }
}
