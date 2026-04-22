// src/payments/prisma-payment.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { PaymentRepository } from "./payment.repository";
import { Payment, PaymentStatus } from "@prisma/client";

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private prisma: PrismaService) {}

  async createPayment(data: {
    bookingId: string;
    amount: number;
    provider: string;
    paymentIntentId: string;
  }): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        bookingId: data.bookingId,
        amount: data.amount,
        provider: data.provider,
        paymentIntentId: data.paymentIntentId,
        status: PaymentStatus.PENDING,
      },
    });
  }

  findByBookingId(bookingId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
    });
  }

  findByPaymentIntentId(paymentIntentId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({ where: { paymentIntentId } });
  }

  updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    return this.prisma.payment.update({ where: { id }, data: { status } });
  }

  findSuccessfulPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { bookingId, status: PaymentStatus.SUCCESS },
    });
  }
}
