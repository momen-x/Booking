export class Review {
  id!: number; //(pk);
  userId!: number; //(FK)
  providerId!: number; //(FK)
  rating!: string;
  comment!: string;
}
