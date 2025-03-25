import path from 'path';
import { Pact, Matchers } from '@pact-foundation/pact';
import { createShortenUrl } from '../../lib/create-shorten-url';

const { like } = Matchers;

const provider = new Pact({
  consumer: 'webapp',
  provider: 'backend-api',
  port: 1234,
  log: path.resolve(__dirname, '../pact/logs', 'pact.log'),
  dir: path.resolve(__dirname, '../pact/pacts'),
  logLevel: 'info',
});

describe('Pact with NestJS shorten-url provider', () => {
  beforeAll(async () => await provider.setup());
  afterAll(async () => await provider.finalize());
  afterEach(async () => await provider.verify());

  describe('POST /shorten-url', () => {
    beforeEach(() => {
      return provider.addInteraction({
        state: undefined,
        uponReceiving: 'a POST request to shorten a url',
        withRequest: {
          method: 'POST',
          path: '/shorten-url',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            url: like('https://example.com/page1/page2/page3'),
          },
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            shortenedUrl: like('http://localhost:1234/abc123'),
          },
        },
      });
    });

    it('sends POST /shorten-url and receives shortened URL', async () => {
      const baseUrl = provider.mockService.baseUrl;
      const response = await createShortenUrl(
        'https://example.com/page1/page2/page3',
        baseUrl
      );
      expect(response).toBe('http://localhost:1234/abc123');
    });
  });
});
