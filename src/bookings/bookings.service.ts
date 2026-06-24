/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { BookingRepository } from "./booking.repository";
import { ProviderProfileRepository } from "src/provider-profile/provider-profile.repository";
import { ServiceRepository } from "src/service/service.repository";
import { UserRepository } from "src/users/user.repository";
import { AvailabilityRepository } from "src/availability/availability.repository";
import { BookingStatus } from "utils/enums";
import { UserRole } from "@prisma/client";
import { DateTime } from "luxon";
import { PaymentRepository } from "src/payments/payment.repository";
import { NotificationsRepository } from "src/notifications/notifications.repository";
import { CreateNotificationDTO } from "src/notifications/dto/create-notifications.dto";

// const zone = "Asia/Gaza";
@Injectable()
export class BookingsService {
  constructor(
    private bookingRepo: BookingRepository,
    private userRepo: UserRepository,
    private providerProfileRepo: ProviderProfileRepository,
    private serviceRepo: ServiceRepository,
    private availabilityRepo: AvailabilityRepository,
    private paymentRepo: PaymentRepository,
    private notificationRepo: NotificationsRepository,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    try {
      await this.checkIfUserExist(userId);
      const provider = await this.checkIfProviderExist(
        createBookingDto.providerId,
      );
      if (!provider.isActive) {
        throw new ConflictException("Provider is not available");
      }
      const service = await this.checkIfServiceExist(
        createBookingDto.serviceId,
      );

      if (service.providerId !== createBookingDto.providerId) {
        throw new ConflictException("Service does not belong to provider");
      }
      const endTime = new Date(createBookingDto.startTime);
      endTime.setMinutes(endTime.getMinutes() + service.duration);

      await this.checkProviderAvailability(
        createBookingDto.providerId,
        createBookingDto.date,
        createBookingDto.startTime, // original, not UTC
        endTime,
      );
      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      const booking = await this.bookingRepo.createBookingWithTransaction(
        userId,
        { ...createBookingDto },
        endTime,
        expiresAt,
      );
      const successCreateProviderMessage: CreateNotificationDTO = {
        title: "Booking pending",
        message: `you booking is pending paid for confirm your booking`,
        type: "BOOKING",
      };
      await this.notificationRepo.create(userId, successCreateProviderMessage);
      return booking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  async findAllByUserId(userId: string) {
    const user = await this.checkIfUserExist(userId);
    const now = new Date(Date.now());
    await this.bookingRepo.findExpiredPendingBookings(now);
    return this.bookingRepo.findBookingsByUserId(user.id);
  }

  async findAllByProviderId(userId: string, role: UserRole) {
    if (role !== UserRole.ADMIN && role !== UserRole.PROVIDER) {
      throw new UnauthorizedException("you can't to do this action");
    }
    const provider = await this.providerProfileRepo.findByUserId(userId);
    if (!provider) throw new NotFoundException("Provider not found");
    if (role === UserRole.PROVIDER && userId !== provider.userId) {
      throw new UnauthorizedException("you can't to do this action");
    }
    return this.bookingRepo.findBookingsByProviderId(provider.id);
  }

  async findByProviderIdAndDay(providerId: string, date: Date) {
    const booking = await this.bookingRepo.findByProviderAndDay(
      providerId,
      date,
    );
    return booking;
  }

  async findOne(id: string) {
    const booking = await this.checkIfBookingExist(id);
    return booking;
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.checkIfBookingExist(id);
    const currentStatus = booking.status as unknown as BookingStatus;

    if (status === BookingStatus.CONFIRMED) {
      // Must have a successful payment before confirming
      const payment = await this.paymentRepo.findByBookingId(id);
      if (!payment || payment.status !== "SUCCESS") {
        throw new BadRequestException(
          "Booking cannot be confirmed without a successful payment",
        );
      }
    }

    this.validateStatusTransition(currentStatus, status);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.bookingRepo.updateBookingStatus(booking.id, status as any);
  }

  async remove(id: string, userId: string, role: UserRole) {
    const booking = await this.checkIfBookingExist(id);
    const isOwner = booking.userId === userId;
    const provider = await this.checkIfProviderExist(booking.providerId);
    const isAdmin = role === UserRole.ADMIN;
    const isProviderOwner = provider?.userId === userId;

    if (!isOwner && !isAdmin)
      throw new UnauthorizedException("you can't to do this action");

    if (!isAdmin && !isOwner && !isProviderOwner)
      throw new UnauthorizedException("you can't to do this action");

    if (role === UserRole.USER && userId !== booking.userId)
      throw new UnauthorizedException("you can't to do this action");
    // Only allow cancellation if booking is still PENDING or CONFIRMED
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      throw new BadRequestException(
        "Cannot cancel a booking with status: " + booking.status,
      );
    }
    await this.bookingRepo.cancelBooking(booking.id);
    return { message: "Booking cancelled successfully" };
  }

  private async checkIfUserExist(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  private async checkIfProviderExist(providerId: string) {
    const provider = await this.providerProfileRepo.findById(providerId);
    if (!provider) {
      throw new NotFoundException("Provider not found");
    }
    return provider;
  }

  private async checkIfServiceExist(serviceId: string) {
    const service = await this.serviceRepo.findServiceById(serviceId);
    if (!service) {
      throw new NotFoundException("Service not found");
    }
    return service;
  }

  private async checkIfBookingExist(bookingId: string) {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    return booking;
  }

  private async checkProviderAvailability(
    providerId: string,
    date: Date,
    startTime: Date | string,
    endTime: Date | string,
  ) {
    try {
      // Convert strings to Date objects if needed
      const startDate =
        typeof startTime === "string" ? new Date(startTime) : startTime;
      const endDate = typeof endTime === "string" ? new Date(endTime) : endTime;

      // Convert all times to Asia/Gaza timezone for consistency
      const startInGaza = DateTime.fromJSDate(startDate, {
        zone: "Asia/Gaza",
      });
      const endInGaza = DateTime.fromJSDate(endDate, { zone: "Asia/Gaza" });

      if (!startInGaza.isValid || !endInGaza.isValid) {
        throw new BadRequestException(
          `Invalid date/time format. startTime: ${startTime}, endTime: ${endTime}`,
        );
      }

      const dayOfWeek = startInGaza.weekday === 7 ? 0 : startInGaza.weekday;
      const startMinutes = startInGaza.hour * 60 + startInGaza.minute;
      const endMinutes = endInGaza.hour * 60 + endInGaza.minute;

      const availabilities =
        await this.availabilityRepo.findAvailabilitiesByProviderId(providerId);

      const isAvailable = availabilities.some(
        (availability) =>
          availability.dayOfWeek === dayOfWeek &&
          availability.startTime <= startMinutes &&
          availability.endTime >= endMinutes,
      );

      if (!isAvailable) {
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const slotsForDay = availabilities.filter(
          (a) => a.dayOfWeek === dayOfWeek,
        );
        const message =
          slotsForDay.length === 0
            ? `Provider has no availability slots on ${dayNames[dayOfWeek]}. Please contact the provider to add availability.`
            : `Requested time is outside provider's available hours on ${dayNames[dayOfWeek]}. Available slots: ${slotsForDay
                .map(
                  (a) =>
                    `${this.minutesToTime(a.startTime)} - ${this.minutesToTime(a.endTime)}`,
                )
                .join(", ")}`;

        throw new ConflictException(message);
      }
    } catch (error) {
      console.error("❌ Error in checkProviderAvailability:", error);
      throw error;
    }
  }

  private validateStatusTransition(
    current: BookingStatus,
    next: BookingStatus,
  ) {
    const allowed: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED], // refund case
      [BookingStatus.CANCELLED]: [], // terminal state
    };

    if (!allowed[current]?.includes(next)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${next}`,
      );
    }
  }

  private getMinutesSinceMidnight(date: Date): number {
    const local = DateTime.fromJSDate(date).setZone("Asia/Gaza");
    return local.hour * 60 + local.minute;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  private toUTC(date: Date, timezone: string) {
    return DateTime.fromJSDate(date, { zone: timezone }).toUTC().toJSDate();
  }
}
