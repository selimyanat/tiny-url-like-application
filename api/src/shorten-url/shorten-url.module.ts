import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateShortenUrlController } from './create-shorten-url/create-shorten-url.controller';
import { CreateShortenUrlUsecase } from './create-shorten-url/create-shorten-url.usecase';
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
  controllers: [CreateShortenUrlController, RedirectToOriginalUrlController],
  providers: [
    {
      provide: 'ShortenUrlRepository',
      useExisting: ShortenUrlRepository, // ✅ Use injected provider
    },
    ShortenUrlIdGeneratorService,
    CreateShortenUrlUsecase,
    RedirectToOriginalUrlUsecase,
  ],
})
export class ShortenUrlModule {}
