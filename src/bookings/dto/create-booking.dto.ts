import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from "class-validator";
import { IsEndTimeAfterStartTime } from "./validation";

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID of the user making the booking",
  })
  providerId!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID of the service being booked",
  })
  serviceId!: string;
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: "2023-10-10",
    description: "Date of the booking (YYYY-MM-DD)",
  })
  date!: Date;
  @IsNotEmpty()
  @ApiProperty({
    example: "2023-10-10T10:00:00.000Z",
    description: "Start time of the booking",
  })
  startTime!: Date;
  @Validate(IsEndTimeAfterStartTime)
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: "2023-10-10T11:00:00.000Z",
    description:
      "End time of the booking (auto-calculated from service duration if not provided)",
  })
  endTime!: Date;
}
