import { Test, TestingModule } from '@nestjs/testing';
import { ShortenUrlController } from './shorten-url.controller';
import { ShortenUrlUsecase } from './shorten-url.usecase';
import { ShortenUrlIdGeneratorService } from './shorten-url.id-generator.service';
import { ConfigModule } from '@nestjs/config';

describe('ShortenUrl controller', () => {
  let underTest: ShortenUrlController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [await ConfigModule.forRoot()],
      controllers: [ShortenUrlController],
      providers: [ShortenUrlIdGeneratorService, ShortenUrlUsecase],
    }).compile();

    underTest = app.get<ShortenUrlController>(ShortenUrlController);
  });

  describe('shortenUrl', () => {
    it('should return a valid Base62 short URL with 10 chars length', async () => {
      const longUrl =
        'https://zapper.xyz/very-long-url/very-long-url/very-long-url';
      const shortenedUrl = await underTest.shortenUrl(longUrl); // Assuming it's async

      // Extract the unique ID part of the URL
      const urlPattern = /^https:\/\/zapper\.xyz\/([A-Za-z0-9]{10})$/;
      const match = shortenedUrl.match(urlPattern);

      expect(shortenedUrl).not.toBeNull();
      expect(match).not.toBeNull(); // Ensure it matches the pattern
      expect(match![1].length).toBe(10); // Validate the ID part has 10 characters
    });
  });
});
