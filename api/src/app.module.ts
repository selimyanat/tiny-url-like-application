import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlModule } from './shorten-url/shorten-url.module';

@Module({
  imports: [ConfigModule.forRoot(), ShortenUrlModule], // Load environment variables
  controllers: [],
  providers: [],
})
export class AppModule {}
