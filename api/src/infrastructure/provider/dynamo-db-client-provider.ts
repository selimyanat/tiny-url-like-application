import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import { fromEnv } from '@aws-sdk/credential-providers';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class DynamoDbClientProvider implements OnModuleInit, OnModuleDestroy {
  private dynamoDBClient: DynamoDBClient | null = null;

  constructor(private readonly configService: ConfigService) {}

  async putItem(key: string, value: string, tableName: string): Promise<void> {
    if (!this.dynamoDBClient)
      throw new Error('DynamoDB client not initialized');

    await this.dynamoDBClient.send(
      new PutItemCommand({
        TableName: tableName,
        Item: {
          shortId: { S: key },
          originalUrl: { S: value },
          createdAt: { S: new Date().toISOString() },
        },
      }),
    );
  }

  async getItem(
    key: string,
    tableName: string,
  ): Promise<Record<string, any> | null> {
    if (!this.dynamoDBClient)
      throw new Error('DynamoDB client not initialized');

    const result = await this.dynamoDBClient.send(
      new GetItemCommand({
        TableName: tableName,
        Key: { shortId: { S: key } },
      }),
    );

    return unmarshall(result.Item);
  }

  async isReady(): Promise<boolean> {
    if (!this.dynamoDBClient) return false;
    try {
      await this.dynamoDBClient.send(new ListTablesCommand({}));
      return true;
    } catch (err) {
      Logger.error('DynamoDB readiness check failed', err);
      return false;
    }
  }

  async onModuleInit() {
    const usePersistent = this.configService.get<string>(
      'USE_PERSISTENT_STORAGE',
      'false',
    );

    if (usePersistent === 'false') {
      Logger.log('🧪 Skipping dynamo connection (non-persistent mode)');
      return;
    }

    this.dynamoDBClient = new DynamoDBClient({
      region: this.configService.get('AWS_REGION', 'local'),
      endpoint: this.configService.get(
        'DYNAMO_ENDPOINT',
        'http://localhost:8000',
      ),
      credentials: fromEnv({}),
    });
    Logger.log('Connected to dynamodb');
  }

  async onModuleDestroy() {
    if (this.dynamoDBClient) {
      this.dynamoDBClient.destroy();
      Logger.log('Dynamodb connection closed');
    }
  }
}
