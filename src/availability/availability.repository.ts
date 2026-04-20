import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";
import { Availability } from "./entities/availability.entity";

export abstract class AvailabilityRepository {
  abstract createAvailability(
    dto: CreateAvailabilityDto,
  ): Promise<Availability>;
  abstract findAvailabilitiesByProviderId(
    providerId: string,
  ): Promise<Availability[]>;
  abstract findAvailabilityById(id: string): Promise<Availability | null>;
  abstract updateAvailability(
    id: string,
    updatedAvailability: UpdateAvailabilityDto,
  ): Promise<Availability>;
  abstract deleteAvailability(id: string): Promise<Availability>;
  abstract findOverlappingAvailabilities(
    providerId: string,
    dayOfWeek: number,
    startTime: number,
    endTime: number,
    excludeId?: string,
  ): Promise<Availability[]>;
}
