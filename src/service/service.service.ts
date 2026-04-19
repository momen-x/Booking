import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServiceRepository } from "./service.repository";
import { UserRole } from "@prisma/client";
import { ProviderProfileRepository } from "../provider-profile/provider-profile.repository";

@Injectable()
export class ServiceAppService {
  constructor(
    private serviceRepo: ServiceRepository,
    private providerProfileRepository: ProviderProfileRepository,
  ) {}
  async create(userId: string, role: UserRole, dto: CreateServiceDto) {
    await this.checkProviderOwnership(dto.providerId, userId, role);
    return await this.serviceRepo.createService(dto);
  }
  async getServicesByProvider(providerId: string) {
    return await this.serviceRepo.findServicesByProviderId(providerId);
  }

  async findOne(id: string) {
    return await this.serviceRepo.findServiceById(id);
  }

  async update(
    id: string,
    userId: string,
    role: UserRole,
    updateServiceDto: UpdateServiceDto,
  ) {
    const service = await this.serviceRepo.findServiceById(id);
    if (!service) throw new NotFoundException("Service not found");
    await this.checkProviderOwnership(service.providerId, userId, role);

    return await this.serviceRepo.updateService(id, updateServiceDto);
  }

  async remove(id: string, role: UserRole, userId: string) {
    const service = await this.serviceRepo.findServiceById(id);
    if (!service) throw new NotFoundException("this service does not exist!");
    await this.checkProviderOwnership(service.providerId, userId, role);

    await this.serviceRepo.deleteService(id);
    return { message: "Service removed successfully" };
  }
  private async checkProviderOwnership(
    providerId: string,
    userId: string,
    role: UserRole,
  ) {
    const provider = await this.providerProfileRepository.findById(providerId);
    if (!provider) throw new NotFoundException("Provider profile not found");
    const isOwner = provider.userId === userId;
    const isAdmin = role === UserRole.ADMIN;
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        "You are not authorized to perform this action",
      );
    }
    return true;
  }
}
