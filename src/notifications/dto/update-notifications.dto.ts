import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateNotificationDTO {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: "true",
  })
  isRead!: boolean;
}
