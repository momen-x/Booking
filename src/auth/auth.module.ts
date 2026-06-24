import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { UserRepository } from "./user.repository";
import { PrismaUserRepository } from "./prisma-user.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { NotificationsRepository } from "src/notifications/notifications.repository";
import { PrismaNotificationsRepository } from "src/notifications/prisma-notifications.repository";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES_IN") ?? "7d" },
      }),
    }),
  ],
})
export class AuthModule {}
