import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";
import { AvailabilityRepository } from "./availability.repository";
import { UserRole } from "@prisma/client";
import { ProviderProfileRepository } from "src/provider-profile/provider-profile.repository";

@Injectable()
export class AvailabilityService {
  constructor(
    private availabilityRepo: AvailabilityRepository,
    private providerProfileRepository: ProviderProfileRepository,
  ) {}
  async create(
    userId: string,
    role: UserRole,
    createAvailabilityDto: CreateAvailabilityDto,
  ) {
    const providerId = await this.checkProviderOwnership(
      createAvailabilityDto.providerId,
      userId,
      role,
    );
    await this.checkForOverlappingSlots(
      providerId,
      createAvailabilityDto.dayOfWeek,
      createAvailabilityDto.startTime,
      createAvailabilityDto.endTime,
    );
    return this.availabilityRepo.createAvailability(createAvailabilityDto);
  }

  async findAllByProvider(providerId: string) {
    const provider = await this.providerProfileRepository.findById(providerId);
    if (!provider) throw new NotFoundException("Provider not found");
    return this.availabilityRepo.findAvailabilitiesByProviderId(providerId);
  }

  async findOne(id: string) {
    const availability = await this.checkProviderExistence(id);
    return availability;
  }

  async update(
    id: string,
    userId: string,
    role: UserRole,
    updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    const availability = await this.checkProviderExistence(id);
    const providerId = await this.checkProviderOwnership(
      availability.providerId,
      userId,
      role,
    );
    const checkAvailability = {
      dayOfWeek: updateAvailabilityDto.dayOfWeek ?? availability.dayOfWeek,
      startTime: updateAvailabilityDto.startTime ?? availability.startTime,
      endTime: updateAvailabilityDto.endTime ?? availability.endTime,
    };
    await this.checkForOverlappingSlots(
      providerId,
      checkAvailability.dayOfWeek,
      checkAvailability.startTime,
      checkAvailability.endTime,
      id,
    );
    return this.availabilityRepo.updateAvailability(id, {
      dayOfWeek: checkAvailability.dayOfWeek,
      startTime: checkAvailability.startTime,
      endTime: checkAvailability.endTime,
    });
  }

  async remove(id: string, userId: string, role: UserRole) {
    const availability = await this.checkProviderExistence(id);

    await this.checkProviderOwnership(availability.providerId, userId, role);

    return await this.availabilityRepo.deleteAvailability(id);
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
        "Only providers can manage their availabilities",
      );
    }
    return provider.id;
  }
  private async checkProviderExistence(availabilityId: string) {
    const availability =
      await this.availabilityRepo.findAvailabilityById(availabilityId);
    if (!availability) {
      throw new NotFoundException("Availability not found");
    }
    return availability;
  }

  private async checkForOverlappingSlots(
    providerId: string,
    dayOfWeek: number,
    startTime: number,
    endTime: number,
    excludeId?: string,
  ) {
    const overlappingSlots =
      await this.availabilityRepo.findOverlappingAvailabilities(
        providerId,
        dayOfWeek,
        startTime,
        endTime,
        excludeId,
      );

    if (overlappingSlots.length > 0) {
      throw new ConflictException(
        "Time slot overlaps with existing availability for this day",
      );
    }
    if (startTime >= endTime) {
      throw new ConflictException("Invalid time range");
    }
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new ConflictException("Invalid day of week");
    }
    if (startTime < 0 || endTime > 1440) {
      throw new ConflictException("Invalid time range");
    }
  }
}
