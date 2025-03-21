import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlController } from './create-shorten-url/shorten-url.controller';
import { ShortenUrlUsecase } from './create-shorten-url/shorten-url.usecase';
import { ShortenUrlIdGeneratorService } from './create-shorten-url/shorten-url.id-generator.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ShortenUrlRepository } from './shorten-url.repository';
import { RedirectToOriginalUrlUsecase } from './redirect-to-original-url/redirect-to-original-url.usecase';
import { RedirectToOriginalUrlController } from './redirect-to-original-url/redirect-to-original-url.controller';

@Module({
  imports: [
    ConfigModule, // ✅ Ensure ConfigModule is available
    InfrastructureModule.register(), // ✅ Register InfrastructureModule dynamically
  ],
  controllers: [ShortenUrlController, RedirectToOriginalUrlController],
  providers: [
    {
      provide: 'ShortenUrlRepository',
      useExisting: ShortenUrlRepository, // ✅ Use injected provider
    },
    ShortenUrlIdGeneratorService,
    ShortenUrlUsecase,
    RedirectToOriginalUrlUsecase,
  ],
})
export class ShortenUrlModule {}
