import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { InMemoryUrlStorageRepository } from './in-memory-url-storage.repository';
import { ShortenUrlRepository } from '../../../shorten-url/shorten-url.repository';
import { PersistentUrlStorageRepository } from './persistent-url-storage.repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { RedisClientProvider } from '../../provider/redis-client.provider';
import { DynamoDbClientProvider } from '../../provider/dynamo-db-client-provider.service';

/**
 * Factory provider to select the appropriate repository implementation based on configuration.
 */
export const ShortenUrlRepositoryFactory: Provider = {
  // TODO: Use a constant for the key
  provide: ShortenUrlRepository,
  useFactory: (
    configService: ConfigService,
    redisClientProvider: RedisClientProvider | null,
    dynamoDbClientProvider: DynamoDbClientProvider | null,
  ) => {
    const usePersistenceStorage = configService.get<string>(
      'USE_PERSISTENT_STORAGE',
      'true',
    );

    if (usePersistenceStorage === 'true') {
      return new PersistentUrlStorageRepository(
        configService,
        redisClientProvider,
        dynamoDbClientProvider,
      );
    }

    return new InMemoryUrlStorageRepository();
  },
  inject: [ConfigService, RedisClientProvider, DynamoDbClientProvider],
};
