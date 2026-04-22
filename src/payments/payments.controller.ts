// src/payments/payments.controller.ts
import * as common from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/users/decorator/current-user.decorator";
import { UserRole } from "@prisma/client";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import * as express from "express";

@common.Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @common.Post("initiate/:bookingId")
  @common.UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Initiate payment for a booking" })
  @ApiResponse({ status: 201, description: "Returns clientSecret for Stripe" })
  initiatePayment(
    @common.Param("bookingId") bookingId: string,
    @CurrentUser() user: { id: string; role: UserRole } | undefined,
  ) {
    if (!user) throw new common.UnauthorizedException();
    return this.paymentsService.initiatePayment(bookingId, user.id);
  }

  // ⚠️ No JWT guard here — Stripe calls this, not your users
  @common.Post("webhook")
  @ApiOperation({ summary: "Stripe webhook handler" })
  handleWebhook(
    @common.Req() req: common.RawBodyRequest<express.Request>,
    @common.Headers("stripe-signature") signature: string,
  ) {
    return this.paymentsService.handleWebhook(req.rawBody!, signature);
  }

  @common.Post("refund/:bookingId")
  @common.UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Refund a payment" })
  @ApiResponse({ status: 200, description: "Refund processed successfully" })
  refundPayment(
    @common.Param("bookingId") bookingId: string,
    @CurrentUser() user: { id: string; role: UserRole } | undefined,
  ) {
    if (!user) throw new common.UnauthorizedException();
    return this.paymentsService.refundPayment(bookingId, user.id, user.role);
  }

  @common.Get("booking/:bookingId")
  @common.UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Get payment by booking ID" })
  getPaymentByBookingId(@common.Param("bookingId") bookingId: string) {
    return this.paymentsService.getPaymentByBookingId(bookingId);
  }
}
