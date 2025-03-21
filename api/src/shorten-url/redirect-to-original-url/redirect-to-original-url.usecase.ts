import { Inject, Injectable } from '@nestjs/common';
import { ShortenUrlRepository } from '../shorten-url.repository';

@Injectable()
export class RedirectToOriginalUrlUsecase {
  constructor(
    @Inject('ShortenUrlRepository')
    private readonly shortenUrlRepository: ShortenUrlRepository,
  ) {}

  async redirectToOriginalUrl(slug: string): Promise<URL | null> {
    const originalUrl = await this.shortenUrlRepository.findOriginalURL(slug);
    return originalUrl ? new URL(originalUrl) : null;
  }
}
