import { Inject, Injectable } from '@nestjs/common';
import { ShortenUrlRepository } from './shorten-url.repository';

@Injectable()
export class GetOriginalUrlUsecase {
  constructor(
    @Inject('ShortenUrlRepository')
    private readonly shortenUrlRepository: ShortenUrlRepository,
  ) {}

  async getOriginalUrl(shortenedUrl: string): Promise<string | null> {
    return await this.shortenUrlRepository.findOriginalURL(shortenedUrl);
  }
}
