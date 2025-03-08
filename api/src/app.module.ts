import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlModule } from './shorten-url/shorten-url.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [ConfigModule.forRoot(), InfrastructureModule, ShortenUrlModule], // Load environment variables
  controllers: [],
  providers: [],
})
export class AppModule {}
