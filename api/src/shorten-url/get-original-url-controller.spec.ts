import { ShortenUrlController } from './shorten-url.controller';
import { GetOriginalUrlController } from './get-original-url.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ShortenUrlModule } from './shorten-url.module';

describe('ShortenUrl controller', () => {
  let shortenUrlController: ShortenUrlController;
  let underTest: GetOriginalUrlController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [await ConfigModule.forRoot(), ShortenUrlModule],
    }).compile();

    shortenUrlController = app.get<ShortenUrlController>(ShortenUrlController);
    underTest = app.get<GetOriginalUrlController>(GetOriginalUrlController);
  });

  describe('getOriginalUrl', () => {
    it('should return the original URL for a given shortened URL', async () => {
      const longUrl =
        'https://zapper.xyz/very-long-url/very-long-url/very-long-url';

      // Use the shorten URL controller to create the shortened URL
      const shortenedResponse = await shortenUrlController.shortenUrl({
        url: longUrl,
      });
      const shortenedUrl = shortenedResponse.shortenedUrl;

      // Now retrieve the original URL using GetOriginalUrlController
      const response = await underTest.getOriginalUrl({
        shortenedUrl: shortenedUrl,
      });

      expect(response).not.toBeNull();
      expect(response.originalUrl).toBe(longUrl);
    });
  });
});
