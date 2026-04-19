import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProviderProfileDto } from "./dto/create-provider-profile.dto";
import { UpdateProviderProfileDto } from "./dto/update-provider-profile.dto";
import { ProviderProfileRepository } from "./provider-profile.repository";
import { UserRole } from "@prisma/client";

@Injectable()
export class ProviderProfileService {
  constructor(private providerProfileRepo: ProviderProfileRepository) {}

  async create(
    userId: string,
    role: UserRole,
    createProviderProfileDto: CreateProviderProfileDto,
  ) {
    if (role === UserRole.PROVIDER) {
      throw new BadRequestException("User is already a provider");
    }
    if (role === UserRole.ADMIN) {
      return await this.providerProfileRepo.createProvider(
        createProviderProfileDto,
      );
    }
    throw new BadRequestException("Unauthorized to create provider profile");
  }
  async findAll() {
    return await this.providerProfileRepo.getAllProviders();
  }

  async findOne(id: string) {
    const providerProfile = await this.providerProfileRepo.findById(id);
    if (!providerProfile) {
      throw new BadRequestException("Provider profile not found");
    }
    return providerProfile;
  }

  async update(
    id: string,
    userId: string,
    userRole: string,
    updateProviderProfileDto: UpdateProviderProfileDto,
  ) {
    const providerProfile = await this.providerProfileRepo.findById(id);
    if (!providerProfile) {
      throw new NotFoundException("Provider profile not found");
    }
    const isOwner = providerProfile?.userId === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new BadRequestException(
        "You are not authorized to update this provider profile",
      );
    }
    return await this.providerProfileRepo.updateProviderProfile(
      id,
      updateProviderProfileDto,
    );
  }

  async remove(userId: string, role: UserRole, id: string) {
    const provider = await this.providerProfileRepo.findById(id);
    if (!provider) throw new NotFoundException("Provider profile not found");
    if (userId !== provider.userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        "You are not authorized to delete this provider profile",
      );
    }
    return await this.providerProfileRepo.deleteProvider(id);
  }
}
