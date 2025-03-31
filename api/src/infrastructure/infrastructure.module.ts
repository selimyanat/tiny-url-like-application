import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlRepository } from '../shorten-url/shorten-url.repository';
import { ShortenUrlRepositoryFactory } from './repository/shorten-url/shorten-url-repository.factory';
import { DynamoDbClientProvider } from './provider/dynamo-db-client-provider';
import { RedisClientProvider } from './provider/redis-client.provider';
import { HealthController } from './monitoring/health.controller';

@Module({
  imports: [ConfigModule],
})
export class InfrastructureModule {
  static register(): DynamicModule {
    return {
      module: InfrastructureModule,
      controllers: [HealthController],
      providers: [
        RedisClientProvider,
        DynamoDbClientProvider,
        ShortenUrlRepositoryFactory,
      ],
      exports: [
        RedisClientProvider,
        DynamoDbClientProvider,
        ShortenUrlRepository,
      ],
    };
  }
}
