import { Injectable } from '@nestjs/common';
import { ShortenUrlIdGeneratorService } from './shorten-url.id-generator.service';

@Injectable()
export class ShortenUrlUsecase {
  private static BASE62_CHARACTERS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  private static BASE62 = ShortenUrlUsecase.BASE62_CHARACTERS.length;

  constructor(private readonly idGenerator: ShortenUrlIdGeneratorService) {}

  createTinyURL(originalURL: string): string {
    const id = this.idGenerator.generateId();
    // encode the id to base 62
    // return the original URL with the id appended
    // write your code here
    const encodedId = this.encodeBase62(Number(id));
    return originalURL + '/' + encodedId;
  }

  private encodeBase62(id: number): string {
    if (id === 0) return ShortenUrlUsecase.BASE62_CHARACTERS[0];

    let encoded = '';
    while (id > 0) {
      const remainder = id % ShortenUrlUsecase.BASE62;
      encoded = ShortenUrlUsecase.BASE62_CHARACTERS[remainder] + encoded;
      id = Math.floor(id / ShortenUrlUsecase.BASE62);
    }
    return encoded;
  }
}
