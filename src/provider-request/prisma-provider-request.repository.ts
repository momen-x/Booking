import { Injectable } from "@nestjs/common";
import { ProviderRequestRepository } from "./provider-request.repository";
import { CreateProviderRequestDto } from "./dto/create-provider-request.dto";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { ProviderRequest } from "./entities/provider-request.entity";

@Injectable()
export class PrismaProviderRequestRepository implements ProviderRequestRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(
    userId: string,
    dto: CreateProviderRequestDto,
  ): Promise<ProviderRequest> {
    return this.prisma.providerRequest.create({
      data: { ...dto, userId },
    });
  }
  findAll(): Promise<ProviderRequest[]> {
    return this.prisma.providerRequest.findMany();
  }
  findById(id: string): Promise<ProviderRequest | null> {
    return this.prisma.providerRequest.findUnique({ where: { id } });
  }
  delete(id: string): Promise<ProviderRequest> {
    return this.prisma.providerRequest.delete({ where: { id } });
  }
}
