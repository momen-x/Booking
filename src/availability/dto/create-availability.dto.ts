import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  providerId!: string;
  @Max(6)
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  dayOfWeek!: number;
  @Min(0)
  @Max(1440)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  startTime!: number;
  @Max(1440)
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  endTime!: number;
}
