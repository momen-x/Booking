import { Injectable } from "@nestjs/common";
import { BookingRepository } from "./booking.repository";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { Booking } from "./entities/bookings.entity";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const { date, endTime, providerId, serviceId, startTime, userId } = dto;
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        providerId,
        endTime,
        date,
        serviceId,
        startTime,
        status: "CONFIRMED",
      },
    });
    return booking;
  }
  async findBookingsByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({ where: { userId } });
    return bookings;
  }
  async findBookingsByProviderId(providerId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { providerId },
    });
    return bookings;
  }
  async findBookingById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    return booking;
  }
  //   async updateBooking(
  //     id: string,
  //     dto: {
  //       date: string;
  //       startTime: Date;
  //       endTime: Date;
  //     },
  //   ): Promise<Booking | null> {
  //     const booking = await this.prisma.booking.delete({
  //       where: { id },
  //     });
  //     // this code in service
  //     // const data = {
  //     //   endTime: dto.endTime ?? booking.endTime,
  //     //   startTime: dto.startTime ?? booking.startTime,
  //     //   date: dto.date ?? booking.date,
  //     // };
  //     const newBooking = await this.prisma.booking.create({
  //       data: {
  //         userId: booking.userId,
  //         providerId: booking.providerId,
  //         endTime: dto.endTime,
  //         date: dto.date,
  //         serviceId: booking.serviceId,
  //         startTime: dto.startTime,
  //         status: "CONFIRMED",
  //       },
  //     });

  //     return newBooking;
  //   }
  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.delete({ where: { id } });
    return booking;
  }
}
