import { CreateBookingDto } from "./dto/create-booking.dto";
import { Booking } from "./entities/bookings.entity";

export abstract class BookingRepository {
  abstract createBookingWithTransaction(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<Booking>;
  abstract createBooking(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<Booking>;
  abstract findBookingsByUserId(userId: string): Promise<Booking[]>;
  abstract findBookingsByProviderId(providerId: string): Promise<Booking[]>;
  abstract findBookingByServiceId(serviceId: string): Promise<Booking[]>;
  abstract findByProviderAndDay(
    serviceId: string,
    date: Date,
  ): Promise<Booking | null>;
  abstract findBookingById(id: string): Promise<Booking | null>;
  abstract updateBookingStatus(id: string, status: string): Promise<Booking>;
  abstract cancelBooking(id: string): Promise<Booking>;
  abstract findOverlappingConfirmedBookings(
    providerId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking[]>;
}
