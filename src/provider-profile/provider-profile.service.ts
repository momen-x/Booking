import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProviderProfileDto } from "./dto/create-provider-profile.dto";
import { UpdateProviderProfileDto } from "./dto/update-provider-profile.dto";
import { ProviderProfileRepository } from "./provider-profile.repository";

@Injectable()
export class ProviderProfileService {
  constructor(private providerProfileRepo: ProviderProfileRepository) {}

  async create(createProviderProfileDto: CreateProviderProfileDto) {
    const newProvideProfile = await this.providerProfileRepo.createProvider(
      createProviderProfileDto,
    );
    return newProvideProfile;
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
    return await this.providerProfileRepo.updateProviderProfile(
      id,
      userId,
      userRole,
      updateProviderProfileDto,
    );
  }

  async remove(id: string) {
    return await this.providerProfileRepo.deleteProvider(id);
  }
}
