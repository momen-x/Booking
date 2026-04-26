import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "your application is pending",
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message!: string;
  @IsEnum(NotificationType)
  @IsNotEmpty()
  @ApiProperty()
  type!: NotificationType;
}
