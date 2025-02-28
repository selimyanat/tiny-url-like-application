import { Controller, Post } from '@nestjs/common';
import { ShortenUrlUsecase } from './shorten-url.usecase';

@Controller('/shorten-url')
export class ShortenUrlController {
  constructor(private readonly shortenUrlUsecase: ShortenUrlUsecase) {}

  @Post()
  shortenUrl(url: string): string {
    return this.shortenUrlUsecase.createTinyURL('https://zapper.xyz');
  }
}
