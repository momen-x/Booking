// provider-request.entity.ts
import { RequestStatus } from "@prisma/client";

export interface ProviderRequest {
  id: string;
  userId: string;
  status: RequestStatus;
  provideName: string;
  IDNumber: string;
  fullName: string;
  birthday: Date;
  nationality: string;
  location: string;
  IDImage: string;
  selfieIDImage: string;
  Portfolio: string[];
  createdAt: Date;
  updatedAt: Date;
}
