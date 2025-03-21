import { Inject, Injectable } from '@nestjs/common';
import { ShortenUrlRepository } from '../shorten-url.repository';

@Injectable()
export class RedirectToOriginalUrlUsecase {
  constructor(
    @Inject('ShortenUrlRepository')
    private readonly shortenUrlRepository: ShortenUrlRepository,
  ) {}

  async getOriginalUrl(shortenedUrl: string): Promise<string | null> {
    // TODO: reconstruct the URL ? or store only the shorted path ??
    const url = 'http://localhost:3000/' + shortenedUrl;
    return await this.shortenUrlRepository.findOriginalURL(url);
  }
}
