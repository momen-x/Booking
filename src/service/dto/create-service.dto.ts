import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Length, Min } from "class-validator";

export class CreateServiceDto {
  @IsNotEmpty()
  @ApiProperty({ description: "ID of the provider offering the service" })
  providerId!: string;
  @IsNotEmpty()
  @Length(3, 255)
  @ApiProperty({ description: "Name of the service" })
  name!: string;
  @IsNotEmpty()
  @Min(13)
  @ApiProperty({ description: "Duration of the service in minutes" })
  duration!: number;
  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  @ApiProperty({ description: "Price of the service" })
  price!: number;
}
