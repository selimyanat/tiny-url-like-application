import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisClientProvider implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null;

  constructor(private readonly configService: ConfigService) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlInSeconds: number): Promise<void> {
    await this.client.set(key, value, { EX: ttlInSeconds });
  }

  async onModuleInit() {
    const usePersistent = this.configService.get<string>(
      'USE_PERSISTENT_STORAGE',
      'false',
    );

    if (usePersistent === 'false') {
      Logger.log('🧪 Skipping Redis connection (non-persistent mode)');
      return;
    }

    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.client = createClient({ url: redisUrl });

    this.client.on('error', (err) =>
      Logger.error('Redis client error', err, 'REDIS_CLIENT'),
    );

    await this.client.connect();
    Logger.log('Connected to Redis');
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      Logger.log('Redis connection closed');
    }
  }
}
