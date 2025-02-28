import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlController } from './shorten-url.controller';
import { ShortenUrlUsecase } from './shorten-url.usecase';
import { ShortenUrlIdGeneratorService } from './shorten-url.id-generator.service';

@Module({
  imports: [ConfigModule.forRoot()], // Load environment variables
  controllers: [ShortenUrlController],
  providers: [ShortenUrlIdGeneratorService, ShortenUrlUsecase],
})
export class ShortenUrlModule {}
