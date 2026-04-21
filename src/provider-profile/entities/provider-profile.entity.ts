export class ProviderProfile {
  constructor(
    public id: string, //(PK)
    public userId: string, //(FK → User)
    public businessName: string,
    public isActive: boolean,
    public description: string | null,
    public location: string | null,
    public createdAt: Date,
  ) {}
}
