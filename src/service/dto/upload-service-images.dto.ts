import { ApiProperty } from "@nestjs/swagger";
import type { Express } from "express";

export class ServicesImagesUploadDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    required: true,
    name: "service-images",
  })
  files?: Express.Multer.File;
}
