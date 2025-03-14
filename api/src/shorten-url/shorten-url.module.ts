import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlController } from './shorten-url.controller';
import { ShortenUrlUsecase } from './shorten-url.usecase';
import { ShortenUrlIdGeneratorService } from './shorten-url.id-generator.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ShortenUrlRepository } from './shorten-url.repository';

@Module({
  imports: [
    ConfigModule, // ✅ Ensure ConfigModule is available
    InfrastructureModule.register(), // ✅ Register InfrastructureModule dynamically
  ],
  controllers: [ShortenUrlController],
  providers: [
    {
      provide: 'ShortenUrlRepository',
      useExisting: ShortenUrlRepository, // ✅ Use injected provider
    },
    ShortenUrlIdGeneratorService,
    ShortenUrlUsecase,
  ],
})
export class ShortenUrlModule {}
