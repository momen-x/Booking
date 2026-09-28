import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { AuthRepository } from "./repo/auth.repository";
import { PrismaAuthRepository } from "./repo/prisma-auth.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { NotificationsRepository } from "src/notifications/repo/notifications.repository";
import { PrismaNotificationsRepository } from "src/notifications/repo/prisma-notifications.repository";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
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
