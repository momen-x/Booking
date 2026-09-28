import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { BookingRepository } from "./repo/booking.repository";
import { PrismaBookingRepository } from "./repo/prisma-booking.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "src/users/repo/user.repository";
import { PrismaUserRepository } from "src/users/repo/prisma-user.repository";
import { ProviderProfileRepository } from "src/provider-profile/repo/provider-profile.repository";
import { PrismaProviderProfileRepository } from "src/provider-profile/repo/prisma-provider-profile.repository";
import { ServiceRepository } from "src/service/repo/service.repository";
import { PrismaServiceRepository } from "src/service/repo/prisma-services.repository";
import { AvailabilityRepository } from "src/availability/repo/availability.repository";
import { PrismaAvailabilityRepository } from "src/availability/repo/prisma-availability.repository";
import { PaymentRepository } from "src/payments/repo/payment.repository";
import { PrismaPaymentRepository } from "src/payments/repo/prisma-payment.repository";
import { NotificationsRepository } from "src/notifications/repo/notifications.repository";
import { PrismaNotificationsRepository } from "src/notifications/repo/prisma-notifications.repository";
import { BookingExpirationCron } from "./booking.expiration.corn";
import { PaymentsModule } from "src/payments/payments.module";

@Module({
  controllers: [BookingsController],
  providers: [
    BookingsService,
    BookingExpirationCron,
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
    {
      provide: PaymentRepository,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  imports: [PrismaModule, UsersModule, JwtModule, PaymentsModule],
})
export class BookingsModule {}
