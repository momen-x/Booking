// dto/create-provider-request.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RequestStatus } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateProviderRequestDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  @ApiPropertyOptional({ required: false })
  status?: RequestStatus;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  provideName!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  IDNumber!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName!: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  birthday!: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nationality!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location!: string;

  // These will be URLs after Cloudinary upload, not file objects
  @ApiPropertyOptional({ type: "string", description: "ID image URL" })
  @IsString()
  @IsOptional()
  IDImage?: string;

  @ApiPropertyOptional({ type: "string", description: "Selfie image URL" })
  @IsString()
  @IsOptional()
  selfieIDImage!: string;

  @ApiPropertyOptional({ type: [String], description: "Portfolio image URLs" })
  @IsArray()
  @IsOptional()
  Portfolio?: string[];
}
