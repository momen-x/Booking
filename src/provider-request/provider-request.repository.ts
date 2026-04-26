// import { ProviderRequest } from "@prisma/client";
import { CreateProviderRequestDto } from "./dto/create-provider-request.dto";
import { ProviderRequest } from "./entities/provider-request.entity";

export abstract class ProviderRequestRepository {
  abstract create(
    userId: string,
    dto: CreateProviderRequestDto,
  ): Promise<ProviderRequest>;
  abstract findAll(): Promise<ProviderRequest[]>;
  abstract findById(id: string): Promise<ProviderRequest | null>;
  abstract delete(id: string): Promise<ProviderRequest>;
}
