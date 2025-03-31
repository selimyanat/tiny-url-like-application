import { ShortenUrlRepository } from '../../../shorten-url/shorten-url.repository';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { RedisClientProvider } from '../../provider/redis-client.provider';
import { DynamoDbClientProvider } from '../../provider/dynamo-db-client-provider.service';

@Injectable()
export class PersistentUrlStorageRepository implements ShortenUrlRepository {
  private readonly DEFAULT_TTL = 100;
  private readonly redisTTL: number;
  private readonly tableName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisClient: RedisClientProvider | null,
    private readonly dynamoDbClient: DynamoDbClientProvider | null,
  ) {
    this.redisTTL = this.configService.get<number>(
      'REDIS_TTL',
      this.DEFAULT_TTL,
    );
    this.tableName = configService.get('DYNAMO_TABLE', 'shortUrls');
  }

  async create(originalUrl: string, shortId: string): Promise<void> {
    const now = new Date().toISOString();

    // Write to DynamoDB
    await this.dynamoDbClient.putItem(shortId, originalUrl, this.tableName);
    // Cache in Redis
    await this.redisClient.set(`short:${shortId}`, originalUrl, this.redisTTL);
  }

  async findOriginalURL(shortId: string): Promise<string | null> {
    // Try cache first
    const cached = await this.redisClient.get(`short:${shortId}`);
    if (cached) {
      Logger.debug(`Cache hit for ${shortId}`);
      return cached;
    }

    Logger.debug(`Cache miss for ${shortId}. Fetching from DynamoDB...`);

    // Fall back to DynamoDB
    const result = await this.dynamoDbClient.getItem(shortId, this.tableName);

    if (!result.Item) return null;

    const item = unmarshall(result.Item);
    const originalUrl = item.originalUrl;

    // Cache for future
    await this.redisClient.set(`short:${shortId}`, originalUrl, this.redisTTL);

    return originalUrl;
  }
}
