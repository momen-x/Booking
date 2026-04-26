// src/services/dto/create-service.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateServiceDto {
  @IsNotEmpty()
  @ApiProperty({ description: "ID of the provider offering the service" })
  providerId!: string;

  @Length(3, 255)
  @IsNotEmpty()
  @ApiProperty({ description: "Name of the service" })
  name!: string;
  @Transform(({ value }) => Number(value))
  @IsPositive()
  @IsNotEmpty()
  @Min(10)
  @ApiProperty({ description: "Duration of the service in minutes" })
  duration!: number;
  @Transform(({ value }) => Number(value))
  @Min(1)
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "Price of the service" })
  price!: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  @ApiPropertyOptional({ description: "URLs of images for the service" })
  images?: string[];
}
