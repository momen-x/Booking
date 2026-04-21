import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { BookingRepository } from "./booking.repository";
import { PrismaBookingRepository } from "./prisma-booking.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "src/users/user.repository";
import { PrismaUserRepository } from "src/users/prisma-user.repository";
import { ProviderProfileRepository } from "src/provider-profile/provider-profile.repository";
import { PrismaProviderProfileRepository } from "src/provider-profile/prisma-provider-profile.repository";
import { ServiceRepository } from "src/service/service.repository";
import { PrismaServiceRepository } from "src/service/prisma-services.repository";
import { AvailabilityRepository } from "src/availability/availability.repository";
import { PrismaAvailabilityRepository } from "src/availability/prisma-availability.repository";

@Module({
  controllers: [BookingsController],
  providers: [
    BookingsService,
    {
      provide: BookingRepository,
      useClass: PrismaBookingRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ProviderProfileRepository,
      useClass: PrismaProviderProfileRepository,
    },
    {
      provide: ServiceRepository,
      useClass: PrismaServiceRepository,
    },
    {
      provide: AvailabilityRepository,
      useClass: PrismaAvailabilityRepository,
    },
  ],
  imports: [PrismaModule, UsersModule, JwtModule],
})
export class BookingsModule {}
