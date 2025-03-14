import { ShortenUrlRepository } from '../../shorten-url/shorten-url.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisUrlRepository implements ShortenUrlRepository {
  private urls: Map<string, string> = new Map();

  create(url: string, shortenedUrl: string): Promise<void> {
    this.urls.set(url, shortenedUrl);
    return Promise.resolve(undefined);
  }

  findURL(url: string): Promise<string | null> {
    const shortenedUrl = this.urls.get(url);
    return Promise.resolve(shortenedUrl);
  }
}
