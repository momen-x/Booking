import { BadRequestException, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "./user.repository";
import { PrismaUserRepository } from "./prisma-user.repository";
import { AuthRolesGuard } from "./role.guard";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
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
      storage: memoryStorage(),
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
