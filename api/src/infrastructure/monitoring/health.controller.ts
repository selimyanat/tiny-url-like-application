import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientProvider } from '../provider/redis-client.provider';
import { DynamoDbClientProvider } from '../provider/dynamo-db-client-provider';

@Controller('monitoring')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisClient: RedisClientProvider | null,
    private readonly dynamoDbClient: DynamoDbClientProvider | null,
  ) {}

  @Get('/readiness')
  async readiness(): Promise<{ status: string }> {
    const usePersistenceStorage = this.configService.get<string>(
      'USE_PERSISTENT_STORAGE',
      'true',
    );

    if (usePersistenceStorage === 'false') {
      return { status: 'OK' };
    }

    return (await this.dynamoDbClient.isReady()) &&
      (await this.redisClient.isReady())
      ? { status: 'OK' }
      : { status: 'KO' };
  }

  @Get('/ping')
  async ping(): Promise<{ status: string }> {
    return { status: 'ok' };
  }
}
