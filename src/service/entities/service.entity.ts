export class Service {
  constructor(
    public id: string, // (PK)
    public providerId: string, // (FK → ProviderProfile)
    public name: string,
    public duration: number,
    public price: number,
    public createdAt: Date,
  ) {}
}
