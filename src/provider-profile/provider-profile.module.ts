import { Module } from '@nestjs/common';
import { ProviderProfileService } from './provider-profile.service';
import { ProviderProfileController } from './provider-profile.controller';

@Module({
  controllers: [ProviderProfileController],
  providers: [ProviderProfileService],
})
export class ProviderProfileModule {}
