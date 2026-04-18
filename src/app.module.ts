import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProvidersModule } from "./providers/providers.module";
import { AvailabilityModule } from "./availability/availability.module";
import { BookingsModule } from "./bookings/bookings.module";
import { ProviderProfileModule } from "./provider-profile/provider-profile.module";
import { ReviewModule } from "./review/review.module";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ProvidersModule,
    AvailabilityModule,
    BookingsModule,
    ProviderProfileModule,
    ReviewModule,
  ],
})
export class AppModule {}
