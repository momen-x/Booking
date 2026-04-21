import { Injectable, ConflictException } from "@nestjs/common";
import { BookingRepository } from "./booking.repository";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { Booking } from "./entities/bookings.entity";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { BookingStatus } from "@prisma/client";

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createBooking(userId: string, dto: CreateBookingDto): Promise<Booking> {
    const { date, endTime, providerId, serviceId, startTime } = dto;
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        providerId,
        endTime,
        date,
        serviceId,
        startTime,
        status: "PENDING",
      },
    });
    return booking;
  }

  /**
   * @description Creates a booking within a transaction to prevent race conditions
   * Atomically checks for overlapping CONFIRMED bookings and creates the new booking
   */
  async createBookingWithTransaction(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<Booking> {
    const { date, endTime, providerId, serviceId, startTime } = dto;

    return await this.prisma.$transaction(async (tx) => {
      // Check for overlapping PENDING or CONFIRMED bookings
      const overlapping = await tx.booking.findFirst({
        where: {
          providerId,
          deletedAt: null,
          status: { in: ["PENDING", "CONFIRMED"] },
          AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        },
      });

      if (overlapping) {
        throw new ConflictException("This time slot is already booked");
      }

      try {
        const booking = await tx.booking.create({
          data: {
            userId,
            providerId,
            endTime,
            date,
            serviceId,
            startTime,
            status: "PENDING",
          },
        });
        return booking;
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.code === "23P01") {
          throw new ConflictException("Time slot already booked");
        }
        throw error;
      }
    });
  }
  /**
   *@description in service must to check if this user id exist!
   * @param userId
   * @returns Booking entity
   */
  async findBookingsByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId, provider: { isActive: true }, deletedAt: null },
      include: {
        service: { select: { name: true, price: true, duration: true } },
        provider: { select: { businessName: true, location: true } },
      },
      orderBy: { date: "asc" },
    });
    return bookings;
  }
  async findBookingsByProviderId(providerId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { providerId, provider: { isActive: true }, deletedAt: null },
    });
    return bookings;
  }
  async findBookingByServiceId(serviceId: string): Promise<Booking[]> {
    const booking = await this.prisma.booking.findMany({
      where: { serviceId, provider: { isActive: true }, deletedAt: null },
    });
    return booking;
  }
  async findByProviderAndDay(
    serviceId: string,
    date: Date,
  ): Promise<Booking | null> {
    const booking = await this.prisma.booking.findFirst({
      where: { serviceId, date, provider: { isActive: true }, deletedAt: null },
    });
    return booking;
  }
  async findBookingById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    return booking;
  }
  /**
   *@description Here they are supposed to confirm the reservation
   * @param id
   * @param status
   * @returns Booking entity
   */
  async updateBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<Booking> {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status: status },
    });
    return booking;
  }
  /**
   * @description Soft delete booking - sets deletedAt timestamp
   * Status is also set to CANCELLED for semantic clarity
   */
  async cancelBooking(id: string): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED", deletedAt: new Date() },
    });
  }
  async findOverlappingConfirmedBookings(
    providerId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        providerId: providerId,
        status: "CONFIRMED",
        deletedAt: null, // Exclude soft-deleted bookings
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
