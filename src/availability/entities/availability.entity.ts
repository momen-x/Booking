export class Availability {
  id!: number; //(PK)
  providerId!: number; //(FK)
  dayOfWeek!: number; //(0-6)
  startTime!: number;
  endTime!: number;
}
