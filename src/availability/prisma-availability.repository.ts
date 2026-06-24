import { Injectable } from "@nestjs/common";
import { AvailabilityRepository } from "./availability.repository";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";
import { Availability } from "./entities/availability.entity";

// will work on create , and get all availabilities by provider id first then move to update and delete

@Injectable()
export class PrismaAvailabilityRepository implements AvailabilityRepository {
  constructor(private prisma: PrismaService) {}
  async createAvailability(
    providerId: string,
    dto: CreateAvailabilityDto,
  ): Promise<Availability> {
    const availability = await this.prisma.availability.create({
      data: {
        providerId: providerId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
    return availability;
  }
  async findAvailabilitiesByProviderId(
    providerId: string,
  ): Promise<Availability[]> {
    const availability = await this.prisma.availability.findMany({
      where: {
        providerId: providerId,
      },
    });
    return availability;
  }
  async findAvailabilityById(id: string): Promise<Availability | null> {
    const availabilities = await this.prisma.availability.findUnique({
      where: {
        id: id,
      },
    });
    return availabilities;
  }
  async updateAvailability(
    id: string,
    updatedAvailability: UpdateAvailabilityDto,
  ): Promise<Availability> {
    const updateAvailability = await this.prisma.availability.update({
      where: {
        id: id,
      },
      data: {
        dayOfWeek: updatedAvailability.dayOfWeek,
        startTime: updatedAvailability.startTime,
        endTime: updatedAvailability.endTime,
      },
    });
    return updateAvailability;
  }
  async deleteAvailability(id: string): Promise<Availability> {
    const availability = await this.prisma.availability.delete({
      where: {
        id: id,
      },
    });
    return availability;
  }

  async findOverlappingAvailabilities(
    providerId: string,
    dayOfWeek: number,
    startTime: number,
    endTime: number,
    excludeId?: string,
  ): Promise<Availability[]> {
    return this.prisma.availability.findMany({
      where: {
        providerId: providerId,
        dayOfWeek: dayOfWeek,
        ...(excludeId && { NOT: { id: excludeId } }),
        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });
  }
}
