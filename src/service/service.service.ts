import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServiceRepository } from "./service.repository";
import { UserRole } from "@prisma/client";
import { ProviderProfileRepository } from "../provider-profile/provider-profile.repository";
import { existsSync, promises as fs } from "fs";
import { join } from "path";

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
    const provide = await this.findOne(providerId);
    if (!provide)
      throw new NotFoundException("this provider profile does not exist!");
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
  uploadServiceImages = async (
    serviceId: string,
    userId: string, // add these
    role: UserRole,
    files: Express.Multer.File[],
  ) => {
    const service = await this.serviceRepo.findServiceById(serviceId);
    if (!service) throw new NotFoundException("Service not found");
    await this.checkProviderOwnership(service.providerId, userId, role);
    const imageUrls = files.map((file) => `/images/${file.filename}`);
    const existingImages = service.images;
    const updatedImages = [...existingImages, ...imageUrls];
    if (updatedImages.length > 3) {
      throw new BadRequestException("A service can have a maximum of 3 images");
    }
    return await this.serviceRepo.addServiceImages(serviceId, updatedImages);
  };

  async removeServiceImage(
    serviceId: string,
    imageUrl: string,
    userId: string,
    role: UserRole,
  ) {
    const service = await this.serviceRepo.findServiceById(serviceId);
    if (!service) throw new NotFoundException("Service not found");
    await this.checkProviderOwnership(service.providerId, userId, role);
    const existingImages = service.images;
    const imageExists = existingImages.includes(imageUrl);
    if (!imageExists)
      throw new NotFoundException("Image not found in this service");

    // Delete physical file from disk
    // const filePath = join(process.cwd(), imageUrl);
    const filePath = join(
      process.cwd(),
      "images/services",
      imageUrl.split("/").pop()!,
    );
    if (existsSync(filePath)) await fs.unlink(filePath);
    const updatedImages = existingImages.filter((img) => img !== imageUrl);
    if (updatedImages.length === existingImages.length)
      throw new NotFoundException("Image not found in this service");

    if (updatedImages.length > 3) {
      throw new BadRequestException("A service can have a maximum of 3 images");
    }

    return await this.serviceRepo.deleteServiceImage(serviceId, updatedImages);
  }

  async updateServiceImage(
    serviceId: string,
    oldImageUrl: string,
    newFile: Express.Multer.File,
    userId: string,
    role: UserRole,
  ) {
    const service = await this.serviceRepo.findServiceById(serviceId);
    if (!service) throw new NotFoundException("Service not found");
    await this.checkProviderOwnership(service.providerId, userId, role);
    const existingImages = service.images;
    const imageIndex = existingImages.indexOf(oldImageUrl);
    if (imageIndex === -1)
      throw new NotFoundException("Image not found in this service");
    const oldFilePath = join(process.cwd(), oldImageUrl);
    if (existsSync(oldFilePath)) await fs.unlink(oldFilePath);
    const newImageUrl = `/images/${newFile.filename}`;
    existingImages[imageIndex] = newImageUrl;
    if (existingImages.length > 3) {
      throw new BadRequestException("A service can have a maximum of 3 images");
    }

    return await this.serviceRepo.replaceServiceImage(
      serviceId,
      existingImages,
    );
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
