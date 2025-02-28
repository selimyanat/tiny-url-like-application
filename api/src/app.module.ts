import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGlobalIdGeneratorService } from './app.global-id-generator.service';

@Module({
  imports: [ConfigModule.forRoot()], // Load environment variables
  controllers: [AppController],
  providers: [AppGlobalIdGeneratorService, AppService],
})
export class AppModule {}
