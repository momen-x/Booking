// ✅ Replace the entire top of your file with this
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  private stripe: InstanceType<typeof Stripe>; // ← fixes "Cannot use namespace as type"

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>("STRIPE_SECRET_KEY")!,
      { apiVersion: "2026-03-25.dahlia" }, // ← updated version
    );
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>,
  ) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
    });
  }

  async refundPayment(paymentIntentId: string) {
    return this.stripe.refunds.create({ payment_intent: paymentIntentId });
  }

  // ✅ Add explicit return type so TypeScript knows what comes back
  constructWebhookEvent(
    rawBody: Buffer,
    signature: string,
  ): { type: string; data: { object: Record<string, unknown> } } {
    const webhookSecret = this.configService.get<string>(
      "STRIPE_WEBHOOK_SECRET",
    )!;

    // ✅ Double cast: first to unknown, then to your type
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    ) as unknown as { type: string; data: { object: Record<string, unknown> } };
  }
}
