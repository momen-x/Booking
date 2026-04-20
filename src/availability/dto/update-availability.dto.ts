import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class UpdateAvailabilityDto {
  @Max(6)
  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  dayOfWeek?: number;
  @Max(1440)
  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  startTime?: number;
  @Max(1440)
  @Min(0)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional()
  endTime?: number;
}
