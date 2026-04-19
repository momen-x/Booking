import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma/prisma.service";
import { ServiceRepository } from "./service.repository";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { Service } from "./entities/service.entity";
@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createService(dto: CreateServiceDto): Promise<Service> {
    const newService = await this.prisma.service.create({
      data: dto,
    });
    return newService;
  }
  async findServiceById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException("this service does not exist!");
    return service;
  }
  async findServicesByProviderId(providerId: string): Promise<Service[]> {
    const provide = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
    });
    if (!provide)
      throw new NotFoundException("this provider profile does not exist!");
    return this.prisma.service.findMany({ where: { providerId } });
  }
  async updateService(id: string, dto: UpdateServiceDto): Promise<Service> {
    return this.prisma.service.update({ where: { id }, data: dto });
  }
  async deleteService(id: string): Promise<{ message: string }> {
    await this.prisma.service.delete({ where: { id } });
    return { message: "Service deleted successfully!" };
  }
}
