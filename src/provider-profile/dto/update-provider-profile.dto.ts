import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProviderProfileDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  businessName?: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  location?: string;
}
