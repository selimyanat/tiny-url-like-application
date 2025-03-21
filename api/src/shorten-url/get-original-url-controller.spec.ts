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

  describe('Redirect to original url', () => {
    it('should return the original URL for a given shortened URL', async () => {
      const longUrl =
        'https://zapper.xyz/very-long-url/very-long-url/very-long-url';

      // Use the shorten URL controller to create the shortened URL
      const shortenedResponse = await shortenUrlController.shortenUrl({
        url: longUrl,
      });

      // Extract the slug from the shortened URL
      const shortenedUrl = shortenedResponse.shortenedUrl;
      const slug = shortenedUrl.split('/').pop();

      // Now retrieve the original URL using GetOriginalUrlController
      const response = await underTest.getOriginalUrl(slug);

      // TODO check with an integration / e2e test the redirection code (302)
      expect(response).toEqual({ url: longUrl });
    });
  });

  it('should return 404 if the shortened URL is not found', async () => {
    const redirect = jest.fn();
    const res = { redirect } as any;

    const slug = 'does-not-exist';
    await expect(underTest.getOriginalUrl(slug)).rejects.toThrow(
      'Shortened URL "does-not-exist" not found',
    );
  });
});
