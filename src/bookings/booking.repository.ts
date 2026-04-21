import { CreateBookingDto } from "./dto/create-booking.dto";
import { Booking } from "./entities/bookings.entity";

export abstract class BookingRepository {
  abstract createBooking(dto: CreateBookingDto): Promise<Booking>;
  abstract findBookingsByUserId(userId: string): Promise<Booking[]>;
  abstract findBookingsByProviderId(providerId: string): Promise<Booking[]>;
  abstract findBookingById(id: string): Promise<Booking | null>;
  abstract cancelBooking(id: string): Promise<Booking | null>; // === remove booking
}
