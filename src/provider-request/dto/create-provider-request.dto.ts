import { RequestStatus } from "@prisma/client";

export class CreateProviderRequestDto {
  status!: RequestStatus;
  provideName!: string;
  IDNumber!: string;
  fullName!: string;
  birthday!: Date;
  nationality!: string;
  location!: string;
  IDImage!: string;
  selfieIDImage!: string;
  Portfolio!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
