import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AvailabilityModule } from "./availability/availability.module";
import { BookingsModule } from "./bookings/bookings.module";
import { ProviderProfileModule } from "./provider-profile/provider-profile.module";
import { ServiceModule } from "./service/service.module";
import { PaymentsModule } from "./payments/payments.module";
import { ProviderRequestModule } from "./provider-request/provider-request.module";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    AvailabilityModule,
    BookingsModule,
    ProviderProfileModule,
    ServiceModule,
    PaymentsModule,
    ProviderRequestModule,
  ],
})
export class AppModule {}
