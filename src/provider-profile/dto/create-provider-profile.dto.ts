import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProviderProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  businessName!: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  location?: string;
}
