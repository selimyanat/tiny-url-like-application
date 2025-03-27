// infrastructure/providers/dynamodb-client.provider.ts
import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromEnv } from '@aws-sdk/credential-providers';

export const DynamoClientProvider: Provider = {
  provide: DynamoDBClient,
  useFactory: (configService: ConfigService): DynamoDBClient => {
    const usePersistent = configService.get<string>(
      'USE_PERSISTENT_STORAGE',
      'false',
    );

    if (usePersistent === 'false') {
      Logger.log('Skipping DynamoDB client creation (non-persistent mode)');
      return null;
    }

    return new DynamoDBClient({
      region: configService.get('AWS_REGION', 'local'),
      endpoint: configService.get('DYNAMO_ENDPOINT', 'http://localhost:8000'),
      credentials: fromEnv({}),
    });
  },
  inject: [ConfigService],
};
