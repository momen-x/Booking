/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { BookingRepository } from "./booking.repository";
import { PaymentRepository } from "src/payments/payment.repository";
import { StripeService } from "src/payments/stripe.service";
import { PaymentStatus, NotificationType } from "@prisma/client";
import { NotificationsRepository } from "src/notifications/notifications.repository";

@Injectable()
export class BookingExpirationCron {
  private readonly logger = new Logger(BookingExpirationCron.name);

  constructor(
    private bookingRepo: BookingRepository,
    private paymentRepo: PaymentRepository,
    private notificationRepo: NotificationsRepository,
    private stripeService: StripeService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cancelExpiredBookings() {
    const now = new Date();
    const expired = await this.bookingRepo.findExpiredPendingBookings(now);

    if (expired.length === 0) return;

    this.logger.log(`Found ${expired.length} expired pending booking(s)`);

    for (const booking of expired) {
      try {
        const pendingPayment = booking.payment.find(
          (p) => p.status === PaymentStatus.PENDING,
        );
        if (pendingPayment) {
          await this.stripeService.cancelPaymentIntent(
            pendingPayment.paymentIntentId,
          );
          await this.paymentRepo.updateStatus(
            pendingPayment.id,
            PaymentStatus.FAILED,
          );
        }

        await this.notificationRepo.create(booking.userId, {
          title: "Booking expired",
          message:
            "Your booking was cancelled because payment wasn't completed in time.",
          type: NotificationType.BOOKING,
        });
      } catch (err) {
        this.logger.error(
          `Failed to clean up expired booking ${booking.id}`,
          err,
        );
      }
    }

    await this.bookingRepo.cancelBookings(expired.map((b) => b.id));
  }
}
