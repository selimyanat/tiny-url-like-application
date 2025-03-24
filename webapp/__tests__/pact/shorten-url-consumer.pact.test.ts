import path from 'path';
import { Pact, Matchers } from '@pact-foundation/pact';
import fetch from 'node-fetch';

const { like } = Matchers;

const provider = new Pact({
  consumer: 'NextJS-ShortenerApp',
  provider: 'NestJS-ShortenerAPI',
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
        state: 'provider can shorten urls',
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
          status: 200,
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
      const response = await fetch(`${baseUrl}/shorten-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'https://example.com/page1/page2/page3' }),
      });

      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        shortenedUrl: 'http://localhost:1234/abc123',
      });
    });
  });
});
