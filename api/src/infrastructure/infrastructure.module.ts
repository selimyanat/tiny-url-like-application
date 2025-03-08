import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InMemoryUrlRepository } from '../infrastructure/repository/in-memory-url.repository';

@Module({
  imports: [ConfigModule.forRoot()], // Load environment variables
  controllers: [],
  providers: [InMemoryUrlRepository],
})
export class InfrastructureModule {}
