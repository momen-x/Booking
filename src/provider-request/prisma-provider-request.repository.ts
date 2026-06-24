import { Injectable } from "@nestjs/common";
import { ProviderRequestRepository } from "./provider-request.repository";
import { CreateProviderRequestDto } from "./dto/create-provider-request.dto";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { ProviderRequest } from "./entities/provider-request.entity";

@Injectable()
export class PrismaProviderRequestRepository implements ProviderRequestRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    userId: string,
    dto: CreateProviderRequestDto,
  ): Promise<ProviderRequest> {
    const created = await this.prisma.providerRequest.create({
      data: {
        userId: userId,
        status: dto.status || "PENDING",
        provideName: dto.provideName,
        IDNumber: dto.IDNumber,
        fullName: dto.fullName,
        birthday: dto.birthday,
        nationality: dto.nationality,
        location: dto.location,
        IDImage: dto.IDImage || "",
        selfieIDImage: dto.selfieIDImage || "",
        Portfolio: dto.Portfolio,
      },
    });

    return created as ProviderRequest;
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
