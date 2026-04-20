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
  async createAvailability(dto: CreateAvailabilityDto): Promise<Availability> {
    const data = await this.prisma.availability.create({
      data: {
        providerId: dto.providerId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
    return this.toDomain(data);
  }
  async findAvailabilitiesByProviderId(
    providerId: string,
  ): Promise<Availability[]> {
    const data = await this.prisma.availability.findMany({
      where: {
        providerId: providerId,
      },
    });
    return data.map((item) => this.toDomain(item));
  }
  async findAvailabilityById(id: string): Promise<Availability | null> {
    const data = await this.prisma.availability.findUnique({
      where: {
        id: id,
      },
    });
    return data ? this.toDomain(data) : null;
  }
  async updateAvailability(
    id: string,
    updatedAvailability: UpdateAvailabilityDto,
  ): Promise<Availability> {
    const data = await this.prisma.availability.update({
      where: {
        id: id,
      },
      data: {
        dayOfWeek: updatedAvailability.dayOfWeek,
        startTime: updatedAvailability.startTime,
        endTime: updatedAvailability.endTime,
      },
    });
    return this.toDomain(data);
  }
  async deleteAvailability(id: string): Promise<Availability> {
    const data = await this.prisma.availability.delete({
      where: {
        id: id,
      },
    });
    return this.toDomain(data);
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
  private toDomain(data: any): Availability {
    return new Availability(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      data.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      data.providerId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      data.dayOfWeek,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      data.startTime,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      data.endTime,
    );
  }
}
