import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlController } from './shorten-url.controller';
import { ShortenUrlUsecase } from './shorten-url.usecase';
import { ShortenUrlIdGeneratorService } from './shorten-url.id-generator.service';
import { InMemoryUrlRepository } from '../infrastructure/repository/in-memory-url.repository';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [ConfigModule.forRoot(), InfrastructureModule], // Load environment variables
  controllers: [ShortenUrlController],
  providers: [
    { provide: 'ShortenUrlRepository', useClass: InMemoryUrlRepository },
    ShortenUrlIdGeneratorService,
    ShortenUrlUsecase,
  ],
})
export class ShortenUrlModule {}
