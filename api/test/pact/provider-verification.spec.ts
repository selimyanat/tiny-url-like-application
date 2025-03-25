import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

let app: INestApplication;

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  await app.listen(3001);
});

afterAll(async () => {
  await app.close();
});

describe('API consumers integration verification', () => {
  it('validates the expectations of the webapp consumer', async () => {
    await new Verifier({
      provider: 'api',
      providerBaseUrl: 'http://localhost:3001', // your Nest app
      pactUrls: [
        path.resolve(
          __dirname,
          '../../../webapp/__tests__/pact/pacts/webapp-backend-api.json',
        ),
      ],
    }).verifyProvider();
  });
});
