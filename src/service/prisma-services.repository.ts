import { Injectable } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma/prisma.service";
import { ServiceRepository } from "./service.repository";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { Service } from "./entities/service.entity";
@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createService(
    dto: CreateServiceDto,
    imageUrls: string[] = [],
  ): Promise<Service> {
    const newService = await this.prisma.service.create({
      data: {
        providerId: dto.providerId,
        name: dto.name,
        duration: dto.duration,
        price: dto.price,
        images: imageUrls, // ✅ use the parameter, not dto.images
      },
    });
    return newService;
  }
  async findAll(): Promise<Service[]> {
    return this.prisma.service.findMany();
  }
  async findServiceById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) return null;
    return service;
  }
  async findServicesByProviderId(providerId: string): Promise<Service[]> {
    return this.prisma.service.findMany({ where: { providerId } });
  }
  async updateService(id: string, dto: UpdateServiceDto): Promise<Service> {
    return this.prisma.service.update({ where: { id }, data: dto });
  }
  async deleteService(id: string) {
    return await this.prisma.service.delete({ where: { id } });
  }
}
