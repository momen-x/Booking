import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { Service } from "./entities/service.entity";

export abstract class ServiceRepository {
  abstract createService(dto: CreateServiceDto): Promise<Service>;
  abstract findServiceById(id: string): Promise<Service | null>;
  abstract findServicesByProviderId(providerId: string): Promise<Service[]>;
  abstract updateService(id: string, dto: UpdateServiceDto): Promise<Service>;
  abstract deleteService(userid: string): Promise<{ message: string }>;
}
