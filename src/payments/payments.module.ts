// src/payments/payments.module.ts
import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { StripeService } from "./stripe.service";
import { PaymentRepository } from "./repo/payment.repository";
import { PrismaPaymentRepository } from "./repo/prisma-payment.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { BookingRepository } from "src/bookings/repo/booking.repository";
import { PrismaBookingRepository } from "src/bookings/repo/prisma-booking.repository";
import { ServiceRepository } from "src/service/repo/service.repository";
import { PrismaServiceRepository } from "src/service/repo/prisma-services.repository";
import { NotificationsRepository } from "src/notifications/repo/notifications.repository";
import { PrismaNotificationsRepository } from "src/notifications/repo/prisma-notifications.repository";

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    StripeService,
    { provide: PaymentRepository, useClass: PrismaPaymentRepository },
    { provide: BookingRepository, useClass: PrismaBookingRepository },
    { provide: ServiceRepository, useClass: PrismaServiceRepository },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [StripeService, PaymentRepository],
})
export class PaymentsModule {}
