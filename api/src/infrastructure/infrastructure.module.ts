import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlRepository } from '../shorten-url/shorten-url.repository';
import { ShortenUrlRepositoryFactory } from './repository/shorten-url/shorten-url-repository.factory';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoClientProvider } from './provider/dynamodb-client.provider';
import { RedisClientProvider } from './provider/redis-client.provider';

@Module({
  imports: [ConfigModule],
})
export class InfrastructureModule {
  static register(): DynamicModule {
    return {
      module: InfrastructureModule,
      providers: [
        RedisClientProvider,
        DynamoClientProvider,
        ShortenUrlRepositoryFactory,
      ],
      exports: [RedisClientProvider, DynamoDBClient, ShortenUrlRepository],
    };
  }
}
