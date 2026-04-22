// src/payments/payments.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { PaymentRepository } from "./payment.repository";
import { BookingRepository } from "src/bookings/booking.repository";
import { ServiceRepository } from "src/service/service.repository";
import { PaymentStatus, BookingStatus, UserRole } from "@prisma/client";
import Stripe from "stripe";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type StripePaymentIntent =
  ReturnType<typeof Stripe.prototype.paymentIntents.retrieve> extends Promise<
    infer T
  >
    ? T
    : never;

@Injectable()
export class PaymentsService {
  constructor(
    private stripeService: StripeService,
    private paymentRepo: PaymentRepository,
    private bookingRepo: BookingRepository,
    private serviceRepo: ServiceRepository,
  ) {}

  // ─── Phase 1: Initiate Payment ─────────────────────────────────────────────
  async initiatePayment(bookingId: string, userId: string) {
    // 1. Check booking exists and belongs to this user
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.userId !== userId)
      throw new ForbiddenException("This booking does not belong to you");

    // 2. Booking must still be PENDING
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Cannot pay for a booking with status: ${booking.status}`,
      );
    }

    // 3. No successful payment already exists
    const existingSuccess =
      await this.paymentRepo.findSuccessfulPaymentByBookingId(bookingId);
    if (existingSuccess) {
      throw new BadRequestException(
        "This booking has already been paid successfully",
      );
    }

    // 4. Get service price
    const service = await this.serviceRepo.findServiceById(booking.serviceId);
    if (!service) throw new NotFoundException("Service not found");

    // 5. Create Stripe PaymentIntent
    const paymentIntent = await this.stripeService.createPaymentIntent(
      service.price,
      "usd",
      { bookingId }, // stored in Stripe metadata — comes back in webhook
    );

    // 6. Save Payment record with PENDING status
    await this.paymentRepo.createPayment({
      bookingId,
      amount: service.price,
      provider: "stripe",
      paymentIntentId: paymentIntent.id,
    });

    // 7. Return clientSecret to frontend
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  // ─── Phase 2: Handle Stripe Webhook ────────────────────────────────────────
  async handleWebhook(rawBody: Buffer, signature: string) {
    // ✅ Type the event explicitly
    let event: {
      type: string;
      data: { object: { id: string; metadata: Record<string, string> } };
    };

    try {
      event = this.stripeService.constructWebhookEvent(
        rawBody,
        signature,
      ) as typeof event;
    } catch {
      throw new BadRequestException("Invalid webhook signature");
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object; // no cast needed now
        await this.handlePaymentSuccess(intent);
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object; // no cast needed now
        await this.handlePaymentFailed(intent);
        break;
      }
    }

    return { received: true };
  }

  // ✅ Replace these two private methods
  private async handlePaymentSuccess(intent: {
    id: string;
    metadata: Record<string, string>;
  }) {
    const payment = await this.paymentRepo.findByPaymentIntentId(intent.id);
    if (!payment) return;
    await this.paymentRepo.updateStatus(payment.id, PaymentStatus.SUCCESS);
    await this.bookingRepo.updateBookingStatus(
      payment.bookingId,
      BookingStatus.CONFIRMED,
    );
  }

  private async handlePaymentFailed(intent: { id: string }) {
    const payment = await this.paymentRepo.findByPaymentIntentId(intent.id);
    if (!payment) return;
    await this.paymentRepo.updateStatus(payment.id, PaymentStatus.FAILED);
  }

  // ─── Refund ────────────────────────────────────────────────────────────────
  async refundPayment(bookingId: string, userId: string, role: UserRole) {
    // 1. Check booking exists
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) throw new NotFoundException("Booking not found");

    // 2. Only booking owner or admin can refund
    const isOwner = booking.userId === userId;
    const isAdmin = role === UserRole.ADMIN;
    if (!isOwner && !isAdmin)
      throw new ForbiddenException("Not authorized to refund this booking");

    // 3. Must have a successful payment to refund
    const payment =
      await this.paymentRepo.findSuccessfulPaymentByBookingId(bookingId);
    if (!payment)
      throw new BadRequestException(
        "No successful payment found for this booking",
      );

    // 4. Call Stripe refund
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.stripeService.refundPayment(payment.paymentIntentId);

    // 5. Update payment → REFUNDED, booking → CANCELLED
    await this.paymentRepo.updateStatus(payment.id, PaymentStatus.REFUNDED);
    await this.bookingRepo.updateBookingStatus(
      bookingId,
      BookingStatus.CANCELLED,
    );

    return { message: "Refund processed successfully" };
  }

  // ─── Query ─────────────────────────────────────────────────────────────────
  async getPaymentByBookingId(bookingId: string) {
    const payment = await this.paymentRepo.findByBookingId(bookingId);
    if (!payment) throw new NotFoundException("Payment not found");
    return payment;
  }
}
