import { CreateProviderProfileDto } from "./dto/create-provider-profile.dto";
import { UpdateProviderProfileDto } from "./dto/update-provider-profile.dto";
import { ProviderProfile } from "./entities/provider-profile.entity";

export abstract class ProviderProfileRepository {
  abstract createProvider(
    data: CreateProviderProfileDto,
  ): Promise<ProviderProfile>;
  abstract getAllProviders(): Promise<ProviderProfile[]>;
  abstract findById(id: string): Promise<ProviderProfile | null>;
  abstract deleteProvider(id: string): Promise<{ message: string }>;
  abstract updateProviderProfile(
    id: string,
    data: UpdateProviderProfileDto,
  ): Promise<ProviderProfile>;
}
