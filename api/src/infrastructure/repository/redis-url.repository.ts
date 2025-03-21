import { ShortenUrlRepository } from '../../shorten-url/shorten-url.repository';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisUrlRepository
  implements ShortenUrlRepository, OnModuleInit, OnModuleDestroy
{
  private readonly DEFAULT_TTL = 100;

  private readonly redisTTL: number;

  private redisClient: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.redisClient = createClient({ url: redisUrl });
    this.redisClient.on('error', (err) =>
      Logger.error('Redis Client Error', err),
    );
    this.redisTTL = this.configService.get<number>(
      'REDIS_TTL',
      this.DEFAULT_TTL,
    );
  }

  async create(url: string, shortenedUrl: string): Promise<void> {
    await this.redisClient.set(
      `shortenedUrl: ${shortenedUrl}`,
      `originalUrl: ${url}`,
      {
        EX: this.redisTTL,
      },
    );
  }

  async findOriginalURL(originalUrl: string): Promise<string | null> {
    return await this.redisClient.get(`originalUrl:${originalUrl}`);
  }

  async onModuleInit() {
    await this.redisClient.connect();
    Logger.debug('✅ Connected to Redis');
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    Logger.debug('🛑 Redis connection closed');
  }
}
