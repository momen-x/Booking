export class Availability {
  constructor(
    public id: string,
    public providerId: string,
    public dayOfWeek: number, //(0-6)
    public startTime: number,
    public endTime: number,
  ) {}
}
export class ReturnAvailability {
  constructor(
    public start: Date,
    public end: Date,
  ) {}
}
