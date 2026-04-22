// src/payments/payments.module.ts
import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { StripeService } from "./stripe.service";
import { PaymentRepository } from "./payment.repository";
import { PrismaPaymentRepository } from "./prisma-payment.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { BookingRepository } from "src/bookings/booking.repository";
import { PrismaBookingRepository } from "src/bookings/prisma-booking.repository";
import { ServiceRepository } from "src/service/service.repository";
import { PrismaServiceRepository } from "src/service/prisma-services.repository";

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    StripeService,
    { provide: PaymentRepository, useClass: PrismaPaymentRepository },
    { provide: BookingRepository, useClass: PrismaBookingRepository },
    { provide: ServiceRepository, useClass: PrismaServiceRepository },
  ],
})
export class PaymentsModule {}
