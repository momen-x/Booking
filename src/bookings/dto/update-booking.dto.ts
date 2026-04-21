import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class UpdateBookingDto {
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    example: "2023-10-10T10:00:00.000Z",
    description: "Date of the booking",
  })
  date?: Date;
  @IsDateString()
  @ApiPropertyOptional({
    example: "2023-10-10T10:00:00.000Z",
    description: "Start time of the booking",
  })
  startTime?: Date;
  @IsDateString()
  @ApiPropertyOptional({
    example: "2023-10-10T11:00:00.000Z",
    description: "End time of the booking",
  })
  endTime?: Date;
}
