import { ShortenUrlRepository } from '../../../shorten-url/shorten-url.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InMemoryUrlStorageRepository implements ShortenUrlRepository {
  private urls: Map<string, string> = new Map();

  create(url: string, encodedUrl: string): Promise<void> {
    this.urls.set(url, encodedUrl);
    return Promise.resolve(undefined);
  }

  findOriginalURL(encodedUrl: string): Promise<string | null> {
    const originalUrl = Array.from(this.urls.keys()).find(
      (key) => this.urls.get(key) === encodedUrl,
    );
    return Promise.resolve(originalUrl || null);
  }
}
