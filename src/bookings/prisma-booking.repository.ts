/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, ConflictException } from "@nestjs/common";
import { BookingRepository } from "./booking.repository";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { Booking } from "./entities/bookings.entity";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { BookingStatus } from "@prisma/client";

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createBooking(
    userId: string,
    dto: CreateBookingDto,
    endTime: Date,
    expiresAt: Date,
  ): Promise<Booking> {
    const { date, providerId, serviceId, startTime } = dto;
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        providerId,
        endTime,
        date,
        serviceId,
        startTime,
        status: "PENDING",
        expiresAt,
      },
    });

    return booking as unknown as Booking;
  }

  /**
   * @description Creates a booking within a transaction to prevent race conditions
   * Atomically checks for overlapping CONFIRMED bookings and creates the new booking
   */
  async createBookingWithTransaction(
    userId: string,
    dto: CreateBookingDto,
    endTime: Date,
    expiresAt: Date,
  ): Promise<Booking> {
    const { date, providerId, serviceId, startTime } = dto;

    // Convert date string "2026-05-13" to DateTime "2026-05-13T00:00:00.000Z"
    let dateTimeValue: Date;
    if (typeof date === "string") {
      dateTimeValue = new Date(`${date}T00:00:00.000Z`);
    } else {
      dateTimeValue = date;
    }

    const b = await this.prisma.$transaction(async (tx) => {
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
            date: dateTimeValue,
            serviceId,
            startTime,
            status: "PENDING",
            expiresAt,
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
    return b as unknown as Booking;
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
    return bookings as unknown as Booking[];
  }
  async findBookingsByProviderId(providerId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        provider: { isActive: true },
        deletedAt: null,
      },
    });
    return bookings as unknown as Booking[];
  }
  async findBookingByServiceId(serviceId: string): Promise<Booking[]> {
    const booking = await this.prisma.booking.findMany({
      where: { serviceId, provider: { isActive: true }, deletedAt: null },
    });
    return booking as unknown as Booking[];
  }
  async findByProviderAndDay(
    serviceId: string,
    date: Date,
  ): Promise<Booking[] | null> {
    const bookings = await this.prisma.booking.findMany({
      where: { serviceId, date, provider: { isActive: true }, deletedAt: null },
    });
    return bookings as unknown as Booking[];
  }
  // async findBooking(providerId: string, date: Date) {
  //   const booking = await this.prisma.booking.findMany({
  //     where: { providerId, date },
  //   });
  //   return booking;
  // }
  async findBookingById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    return booking as unknown as Booking;
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
    return booking as unknown as Booking;
  }
  /**
   * @description Soft delete booking - sets deletedAt timestamp
   * Status is also set to CANCELLED for semantic clarity
   */
  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED", deletedAt: new Date() },
    });
    return booking as unknown as Booking;
  }
  async findOverlappingConfirmedBookings(
    providerId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
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
    return bookings as unknown as Booking[];
  }
  async findExpiredPendingBookings(now: Date) {
    return this.prisma.booking.findMany({
      where: {
        status: BookingStatus.PENDING,
        expiresAt: { lt: now },
        deletedAt: null,
      },
      include: { payment: true }, // ← add this
    });
  }

  async cancelBookings(ids: string[]): Promise<void> {
    await this.prisma.booking.updateMany({
      where: { id: { in: ids } },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}
