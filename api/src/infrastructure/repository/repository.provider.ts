import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { InMemoryUrlRepository } from './in-memory-url.repository';
import { ShortenUrlRepository } from '../../shorten-url/shorten-url.repository';
import { RedisUrlRepository } from './redis-url.repository';

/**
 * Factory provider to select the appropriate repository implementation based on configuration.
 */
export const RepositoryProvider: Provider = {
  // TODO: Use a constant for the key
  //provide: 'ShortenUrlRepository',
  provide: ShortenUrlRepository,
  useFactory: (configService: ConfigService) => {
    const persistenceType = configService.get<string>(
      'CACHE_PERSISTENCE',
      'memory',
    );

    if (persistenceType === 'redis') {
      return new RedisUrlRepository(configService);
    }

    return new InMemoryUrlRepository();
  },
  inject: [ConfigService], // ✅ Ensure ConfigService is available
};
