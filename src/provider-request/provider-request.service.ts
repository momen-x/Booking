import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProviderRequestDto } from "./dto/create-provider-request.dto";
import { ProviderRequestRepository } from "./provider-request.repository";
import { CloudinaryService } from "src/config/cloudinary.service";
import { NotificationsRepository } from "src/notifications/notifications.repository";

@Injectable()
export class ProviderRequestService {
  constructor(
    private readonly providerRequestRepo: ProviderRequestRepository,
    private cloudinaryService: CloudinaryService,
    private notificationsRepo: NotificationsRepository,
  ) {}
  async create(
    userId: string,
    createProviderRequestDto: CreateProviderRequestDto,
    files: {
      IDImage?: Express.Multer.File[];
      selfieIDImage?: Express.Multer.File[];
      Portfolio?: Express.Multer.File[];
    },
  ) {
    // Upload images to Cloudinary
    let IDImageUrl = "";
    let selfieIDImageUrl = "";
    let portfolioUrls: string[] = [];

    // Upload ID Image
    if (files.IDImage && files.IDImage[0]) {
      const uploadResult = await this.cloudinaryService.uploadFile(
        files.IDImage[0],
        "provider-requests/id-images",
      );
      IDImageUrl = uploadResult.url;
    }

    // Upload Selfie Image
    if (files.selfieIDImage && files.selfieIDImage[0]) {
      const uploadResult = await this.cloudinaryService.uploadFile(
        files.selfieIDImage[0],
        "provider-requests/selfie-images",
      );
      selfieIDImageUrl = uploadResult.url;
    }

    // Upload Portfolio Images
    if (files.Portfolio && files.Portfolio.length > 0) {
      const uploadPromises = files.Portfolio.map((file) =>
        this.cloudinaryService.uploadFile(file, "provider-requests/portfolio"),
      );
      const uploadResults = await Promise.all(uploadPromises);
      portfolioUrls = uploadResults.map((result) => result.url);
    }

    // Prepare data for database
    const requestData = {
      ...createProviderRequestDto,
      IDImage: IDImageUrl,
      selfieIDImage: selfieIDImageUrl,
      Portfolio: portfolioUrls,
    };

    const requestProvider = await this.providerRequestRepo.create(
      userId,
      requestData,
    );
    await this.notificationsRepo.create(userId, {
      title: "Provider request",
      message:
        "Your application will checking , we will response u in 48 hours",
      type: "PROVIDER_REQUEST",
    });
    if (requestProvider) return { success: true };
    return { success: false };
  }

  findAll() {
    return this.providerRequestRepo.findAll();
  }

  async findOne(id: string) {
    const request = await this.checkIfRequestExist(id);
    return request;
  }

  async remove(id: string) {
    const request = await this.checkIfRequestExist(id);
    return this.providerRequestRepo.delete(request.id);
  }

  async checkIfRequestExist(id: string) {
    const request = await this.providerRequestRepo.findById(id);
    if (!request) {
      throw new NotFoundException("request not found");
    }
    return request;
  }
}
