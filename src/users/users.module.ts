import { BadRequestException, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "./user.repository";
import { PrismaUserRepository } from "./prisma-user.repository";
import { AuthRolesGuard } from "./role.guard";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { CloudinaryService } from "src/config/cloudinary.service";
import { BookingRepository } from "src/bookings/booking.repository";
import { PrismaBookingRepository } from "src/bookings/prisma-booking.repository";

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CloudinaryService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: BookingRepository,
      useClass: PrismaBookingRepository,
    },
    AuthRolesGuard,
  ],
  imports: [
    JwtModule,
    PrismaModule,
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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  ],
  exports: [UsersService, AuthRolesGuard],
})
export class UsersModule {}
