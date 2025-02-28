import { Injectable } from '@nestjs/common';
import { AppGlobalIdGeneratorService } from './app.global-id-generator.service';

@Injectable()
export class AppService {
  private static BASE62_CHARACTERS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  private static BASE62 = AppService.BASE62_CHARACTERS.length;

  constructor(private readonly idGenerator: AppGlobalIdGeneratorService) {}

  createTinyURL(originalURL: string): string {
    const id = this.idGenerator.generateId();
    // encode the id to base 62
    // return the original URL with the id appended
    // write your code here
    const encodedId = this.encodeBase62(Number(id));
    return originalURL + '/' + encodedId;
  }

  private encodeBase62(id: number): string {
    if (id === 0) return AppService.BASE62_CHARACTERS[0];

    let encoded = '';
    while (id > 0) {
      const remainder = id % AppService.BASE62;
      encoded = AppService.BASE62_CHARACTERS[remainder] + encoded;
      id = Math.floor(id / AppService.BASE62);
    }
    return encoded;
  }
}
