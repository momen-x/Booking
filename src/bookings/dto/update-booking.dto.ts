import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { BookingStatus } from "utils/enums";

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
export class updateBookingStatus {
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  @ApiProperty()
  status!: BookingStatus;
}
