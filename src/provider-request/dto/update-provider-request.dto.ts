import { ApiPropertyOptional } from "@nestjs/swagger";
import { RequestStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateProviderRequestDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  @ApiPropertyOptional({ required: false })
  status?: RequestStatus;
}
