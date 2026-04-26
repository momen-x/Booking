import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateServiceDto } from "./create-service.dto";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  @ApiPropertyOptional({ description: "Array of image URLs to remove" })
  imagesToRemove?: string[];
}
