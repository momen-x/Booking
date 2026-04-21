import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID of the user making the booking",
  })
  userId!: string;
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
    example: "2023-10-10T10:00:00.000Z",
    description: "Date of the booking",
  })
  date!: Date;
  @IsDateString()
  @ApiProperty({
    example: "2023-10-10T10:00:00.000Z",
    description: "Start time of the booking",
  })
  startTime!: Date;
  @IsDateString()
  @ApiProperty({
    example: "2023-10-10T11:00:00.000Z",
    description: "End time of the booking",
  })
  endTime!: Date;
}
