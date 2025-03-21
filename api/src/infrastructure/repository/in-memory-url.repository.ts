import { ShortenUrlRepository } from '../../shorten-url/shorten-url.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InMemoryUrlRepository implements ShortenUrlRepository {
  private urls: Map<string, string> = new Map();

  create(url: string, shortenedUrl: string): Promise<void> {
    this.urls.set(url, shortenedUrl);
    return Promise.resolve(undefined);
  }

  findOriginalURL(shortenedUrl: string): Promise<string | null> {
    const originalUrl = Array.from(this.urls.keys()).find(
      (key) => this.urls.get(key) === shortenedUrl,
    );
    return Promise.resolve(originalUrl || null);
  }
}
