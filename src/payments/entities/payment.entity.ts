import { PaymentStatus } from "utils/enums";

export class Payment {
  constructor(
    public id: string,
    public amount: number,
    public status: PaymentStatus,
    public provider: string,
    public bookingId: string,
    public createdAt: Date,
  ) {}
}
