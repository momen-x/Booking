import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { BookingRepository } from "./booking.repository";
import { PrismaBookingRepository } from "./prisma-booking.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";

@Module({
  controllers: [BookingsController],
  providers: [
    BookingsService,
    {
      provide: BookingRepository,
      useClass: PrismaBookingRepository,
    },
  ],
  imports: [PrismaModule],
})
export class BookingsModule {}
