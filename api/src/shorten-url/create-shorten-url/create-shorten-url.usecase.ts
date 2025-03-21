import { Inject, Injectable } from '@nestjs/common';
import { ShortenUrlIdGeneratorService } from './shorten-url.id-generator.service';
import { ShortenUrlRepository } from '../shorten-url.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateShortenUrlUsecase {
  private static BASE62_CHARACTERS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  private static BASE62 = CreateShortenUrlUsecase.BASE62_CHARACTERS.length;

  private readonly shortenedBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly idGenerator: ShortenUrlIdGeneratorService,
    @Inject('ShortenUrlRepository')
    private readonly shortenUrlRepository: ShortenUrlRepository,
  ) {
    if (!this.configService.get<number>('SHORTENED_BASE_URL'))
      throw new Error(
        'SHORTENED_BASE_URL is not defined in the environment variables',
      );
    this.shortenedBaseUrl =
      this.configService.get<string>('SHORTENED_BASE_URL');
  }

  async shortenUrl(originalURL: string): Promise<string> {
    const id = this.idGenerator.generateId();
    const encodedId = this.encodeBase62(Number(id));
    const shortenedUrl = this.shortenedBaseUrl + '/' + encodedId;
    await this.shortenUrlRepository.create(originalURL, shortenedUrl);
    return shortenedUrl;
  }

  private encodeBase62(id: number): string {
    if (id === 0) return CreateShortenUrlUsecase.BASE62_CHARACTERS[0];

    let encoded = '';
    while (id > 0) {
      const remainder = id % CreateShortenUrlUsecase.BASE62;
      encoded = CreateShortenUrlUsecase.BASE62_CHARACTERS[remainder] + encoded;
      id = Math.floor(id / CreateShortenUrlUsecase.BASE62);
    }
    return encoded;
  }
}
