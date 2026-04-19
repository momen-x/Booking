import { BadRequestException, Module } from "@nestjs/common";
import { ServiceAppService } from "./service.service";
import { ServiceController } from "./service.controller";
import { PrismaServiceRepository } from "./prisma-services.repository";
import { ServiceRepository } from "./service.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { PrismaProviderProfileRepository } from "src/provider-profile/prisma-provider-profile.repository";
import { ProviderProfileRepository } from "src/provider-profile/provider-profile.repository";
import { diskStorage } from "multer";
import { MulterModule } from "@nestjs/platform-express";
import { join, extname } from "path";

@Module({
  controllers: [ServiceController],
  providers: [
    ServiceAppService,
    {
      provide: ServiceRepository,
      useClass: PrismaServiceRepository,
    },
    {
      provide: ProviderProfileRepository,
      useClass: PrismaProviderProfileRepository,
    },
  ],
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule,
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), "images/services"),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${uniqueSuffix}${ext}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException("Invalid file type"), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  ],
})
export class ServiceModule {}
