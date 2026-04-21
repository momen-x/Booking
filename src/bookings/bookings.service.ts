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

const zone = "Asia/Gaza";
@Injectable()
export class BookingsService {
  constructor(
    private bookingRepo: BookingRepository,
    private userRepo: UserRepository,
    private providerProfileRepo: ProviderProfileRepository,
    private serviceRepo: ServiceRepository,
    private availabilityRepo: AvailabilityRepository,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // 1. Verify user, provider, and service exist
    await this.checkIfUserExist(userId);
    const provider = await this.checkIfProviderExist(
      createBookingDto.providerId,
    );
    if (!provider.isActive) {
      throw new ConflictException("Provider is not available");
    }
    const service = await this.checkIfServiceExist(createBookingDto.serviceId);

    // 2. Service-Provider Validation (BEFORE calculations)
    if (service.providerId !== createBookingDto.providerId) {
      throw new ConflictException("Service does not belong to provider");
    }

    // 3. Calculate endTime from service duration if not provided
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const startTimeUTC = this.toUTC(createBookingDto.startTime, zone);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const endTimeUTC = this.toUTC(createBookingDto.endTime, zone);
    // 4. Check provider availability for the requested day/tim
    await this.checkProviderAvailability(
      createBookingDto.providerId,
      createBookingDto.date,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      startTimeUTC,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      endTimeUTC,
    );

    // 5. Create the booking with transaction (handles overlap check + creation atomically)
    const bookingData = {
      ...createBookingDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      startTime: startTimeUTC,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      endTime: endTimeUTC,
    };

    const booking = await this.bookingRepo.createBookingWithTransaction(
      userId,
      bookingData,
    );
    return booking;
  }

  async findAllByUserId(userId: string) {
    const user = await this.checkIfUserExist(userId);
    return this.bookingRepo.findBookingsByUserId(user.id);
  }

  async findAllByProviderId(
    providerId: string,
    userId: string,
    role: UserRole,
  ) {
    if (role !== UserRole.ADMIN && role !== UserRole.PROVIDER)
      throw new UnauthorizedException("you can't to do this action");
    if (role === UserRole.PROVIDER && userId !== providerId) {
      throw new UnauthorizedException("you can't to do this action");
    }
    const provider = await this.checkIfProviderExist(providerId);
    return this.bookingRepo.findBookingsByProviderId(provider.id);
  }

  // async findAllByServiceId(serviceId: string) {
  //   const service = await this.checkIfServiceExist(serviceId);
  //   return this.bookingRepo.findBookingByServiceId(service.id);
  // }
  async findByProviderAndDay(serviceId: string, date: Date) {
    const booking = await this.bookingRepo.findByProviderAndDay(
      serviceId,
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
      //toDo remove the comment on the next code:
      // const payment = await this.paymentRepo.findByBookingId(id);
      // if (!payment || payment.status !== PaymentStatus.SUCCESS) {
      //   throw new BadRequestException(
      //     "Booking cannot be confirmed without a successful payment",
      //   );
      // }
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
    startTime: Date,
    endTime: Date,
  ) {
    // Get the day of week from the date (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = new Date(date).getDay();

    // Get the time in minutes since midnight
    const startMinutes = this.getMinutesSinceMidnight(startTime);
    const endMinutes = this.getMinutesSinceMidnight(endTime);

    // Check if provider has availability for this day and time
    const availabilities =
      await this.availabilityRepo.findAvailabilitiesByProviderId(providerId);

    const isAvailable = availabilities.some(
      (availability) =>
        availability.dayOfWeek === dayOfWeek &&
        availability.startTime <= startMinutes &&
        availability.endTime >= endMinutes,
    );

    if (!isAvailable) {
      throw new ConflictException(
        "Provider is not available for the requested date and time",
      );
    }
  }

  // Note: Overlap check is now handled in the repository transaction
  // This method is kept for reference but is no longer called
  // private async checkForOverlappingConfirmedBookings(
  //   providerId: string,
  //   startTime: Date,
  //   endTime: Date,
  // ) {
  //   const overlappingBookings =
  //     await this.bookingRepo.findOverlappingConfirmedBookings(
  //       providerId,
  //       startTime,
  //       endTime,
  //     );

  //   if (overlappingBookings.length > 0) {
  //     throw new ConflictException(
  //       "Time slot is already booked with a confirmed booking",
  //     );
  //   }
  //   if (startTime >= endTime) {
  //     throw new BadRequestException("Invalid time range");
  //   }
  // }

  // private validateStatusTransition(
  //   currentStatus: BookingStatus,
  //   newStatus: BookingStatus,
  // ) {
  //   // Status flow: PENDING → CONFIRMED / CANCELLED
  //   if (currentStatus === BookingStatus.PENDING) {
  //     if (
  //       newStatus !== BookingStatus.CONFIRMED &&
  //       newStatus !== BookingStatus.CANCELLED
  //     ) {
  //       throw new BadRequestException(
  //         `Cannot transition from ${currentStatus} to ${newStatus}`,
  //       );
  //     }
  //   } else if (currentStatus === BookingStatus.CONFIRMED) {
  //     // Once confirmed, status cannot be changed (awaiting payment/completion)
  //     throw new BadRequestException(
  //       "Cannot update status of a confirmed booking. Status stays PENDING until payment confirmation.",
  //     );
  //   } else if (currentStatus === BookingStatus.CANCELLED) {
  //     throw new BadRequestException(
  //       "Cannot update status of a cancelled booking",
  //     );
  //   }
  // }
  //todo understand this code
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
    const d = new Date(date);
    return d.getHours() * 60 + d.getMinutes();
  }
  private toUTC(date: Date, timezone: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return DateTime.fromJSDate(date, { zone: timezone }).toUTC().toJSDate();
  }
}
