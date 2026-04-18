import { BookingStatus } from "utils/enums";

export class User {
  constructor(
    public id: number, //(PK)
    public userId: number, //(FK)
    public providerId: number, //(FK)
    public serviceId: number, // (FK)
    public date: Date,
    public startTime: Date,
    public endTime: Date,
    public status: BookingStatus,
  ) {}
}
