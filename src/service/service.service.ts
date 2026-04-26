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
import { CloudinaryService } from "src/config/cloudinary.service";

@Injectable()
export class ServiceAppService {
  constructor(
    private serviceRepo: ServiceRepository,
    private providerProfileRepository: ProviderProfileRepository,
    private cloudinaryService: CloudinaryService,
  ) {}
  async create(
    userId: string,
    role: UserRole,
    dto: CreateServiceDto,
    files?: Express.Multer.File[],
  ) {
    await this.checkProviderOwnership(dto.providerId, userId, role);

    // Upload images to Cloudinary if provided
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      if (files.length > 3) {
        throw new BadRequestException("Maximum 3 images allowed");
      }
      const uploadedImages = await this.cloudinaryService.uploadMultipleFiles(
        files,
        "services",
      );
      imageUrls = uploadedImages.map((img) => img.url);
    }

    return await this.serviceRepo.createService(dto, imageUrls);
  }

  async getServicesByProvider(providerId: string) {
    const provider = await this.providerProfileRepository.findById(providerId);
    if (!provider) throw new NotFoundException("Provider profile not found");
    return await this.serviceRepo.findServicesByProviderId(providerId);
  }

  async findOne(id: string) {
    const service = await this.serviceRepo.findServiceById(id);
    if (!service) throw new NotFoundException("this service does not exist!");
    return service;
  }
  async findAll() {
    return await this.serviceRepo.findAll();
  }

  async update(
    id: string,
    userId: string,
    role: UserRole,
    updateServiceDto: UpdateServiceDto,
    newFiles?: Express.Multer.File[],
  ) {
    const { imagesToRemove, ...dto } = updateServiceDto;
    const service = await this.serviceRepo.findServiceById(id);
    if (!service) throw new NotFoundException("Service not found");
    await this.checkProviderOwnership(service.providerId, userId, role);

    let updatedImages = [...(service.images || [])];

    if (imagesToRemove && imagesToRemove.length > 0) {
      for (const imageUrl of imagesToRemove) {
        const publicId = this.extractPublicIdFromUrl(imageUrl);
        await this.cloudinaryService.deleteFile(publicId);
        updatedImages = updatedImages.filter((img) => img !== imageUrl);
      }
    }

    if (newFiles && newFiles.length > 0) {
      const totalImages = updatedImages.length + newFiles.length;
      if (totalImages > 3) {
        throw new BadRequestException(
          "A service can have a maximum of 3 images",
        );
      }

      const uploadedImages = await this.cloudinaryService.uploadMultipleFiles(
        newFiles,
        "services",
      );
      const newImageUrls = uploadedImages.map((img) => img.url);
      updatedImages = [...updatedImages, ...newImageUrls];
    }

    // Update the service with new data and new images array
    const updateData = {
      ...dto,
      images: updatedImages,
    };

    return await this.serviceRepo.updateService(id, updateData);
  }

  async remove(id: string, role: UserRole, userId: string) {
    const service = await this.serviceRepo.findServiceById(id);
    if (!service) throw new NotFoundException("this service does not exist!");
    await this.checkProviderOwnership(service.providerId, userId, role);

    // Delete all images from Cloudinary
    if (service.images && service.images.length > 0) {
      for (const imageUrl of service.images) {
        const publicId = this.extractPublicIdFromUrl(imageUrl);
        await this.cloudinaryService.deleteFile(publicId);
      }
    }

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
  private extractPublicIdFromUrl(url: string): string {
    // Example: https://res.cloudinary.com/demo/image/upload/v12345678/booking-app/services/image_name.jpg
    // Returns: booking-app/services/image_name
    const parts = url.split("/");
    const fileNameWithExt = parts.pop() || "";
    const fileName = fileNameWithExt.split(".")[0];
    const folderIndex = parts.indexOf("booking-app");
    if (folderIndex !== -1) {
      return parts.slice(folderIndex).join("/") + "/" + fileName;
    }
    return fileName;
  }
}
