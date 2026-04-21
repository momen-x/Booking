import { BookingStatus } from "@prisma/client";

export class Booking {
  constructor(
    public id: string, //(PK)
    public userId: string, //(FK)
    public providerId: string, //(FK)
    public serviceId: string, // (FK)
    public date: Date,
    public startTime: Date,
    public endTime: Date,
    public status: BookingStatus, // (PENDING, CONFIRMED, CANCELLED)
    public createdAt: Date,
  ) {}
}
