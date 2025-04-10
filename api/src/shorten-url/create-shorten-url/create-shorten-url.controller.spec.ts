import { Test, TestingModule } from '@nestjs/testing';
import { CreateShortenUrlController } from './create-shorten-url.controller';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlModule } from '../shorten-url.module';

describe('ShortenUrl controller', () => {
  let underTest: CreateShortenUrlController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [await ConfigModule.forRoot(), ShortenUrlModule],
    }).compile();

    underTest = app.get<CreateShortenUrlController>(CreateShortenUrlController);
  });

  describe('shortenUrl', () => {
    it('should return a valid Base62 short URL with 10 chars length', async () => {
      const longUrl =
        'https://zapper.xyz/very-long-url/very-long-url/very-long-url';
      const response = await underTest.shortenUrl({ url: longUrl });

      // Extract the unique ID part of the URL
      const baseUrl = process.env.SHORTENED_BASE_URL;
      if (!baseUrl) throw new Error('SHORTENED_BASE_URL is not defined');

      const escapedBaseUrl = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape for regex
      const urlPattern = new RegExp(`^${escapedBaseUrl}/([A-Za-z0-9]{10})$`);
      const match = response?.shortenedUrl.match(urlPattern);
      console.log(response?.shortenedUrl);

      expect(response).not.toBeNull();
      expect(match).not.toBeNull(); // Ensure it matches the pattern
      expect(match![1].length).toBe(10); // Validate the ID part has 10 characters
    });
  });
});
