import { ApiProperty } from "@nestjs/swagger";
import { RequestStatus } from "@prisma/client";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateProviderRequestDto {
  @IsEnum(RequestStatus)
  @IsNotEmpty()
  @ApiProperty()
  status!: RequestStatus;
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
  @IsDate()
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
  //todo
  IDImage!: string;
  //todo
  selfieIDImage!: string;
  //todo
  Portfolio!: string[];
}
