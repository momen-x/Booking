export class Provider {
  id!: number; //(PK)
  providerId!: number; //(FK → ProviderProfile)
  name!: string;
  duration!: number; //(minutes)
  price!: number;
}
