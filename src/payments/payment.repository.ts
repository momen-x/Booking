// src/payments/payment.repository.ts
import { Payment } from "@prisma/client";
import { PaymentStatus } from "@prisma/client";

export abstract class PaymentRepository {
  abstract createPayment(data: {
    bookingId: string;
    amount: number;
    provider: string;
    paymentIntentId: string;
  }): Promise<Payment>;

  abstract findByBookingId(bookingId: string): Promise<Payment | null>;
  abstract findByPaymentIntentId(
    paymentIntentId: string,
  ): Promise<Payment | null>;
  abstract updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
  abstract findSuccessfulPaymentByBookingId(
    bookingId: string,
  ): Promise<Payment | null>;
}
