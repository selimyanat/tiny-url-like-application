import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ShortenUrlUsecase } from './shorten-url.usecase';
import { CreateShortenUrlDto } from './create-shorten-url.dto';

@Controller('/shorten-url')
export class ShortenUrlController {
  constructor(private readonly shortenUrlUsecase: ShortenUrlUsecase) {}

  @Post()
  async shortenUrl(
    @Body() request: CreateShortenUrlDto,
  ): Promise<{ shortenedUrl: string }> {
    Logger.log(`Received url ${request.url} to shorten`);
    const shortenedUrl = await this.shortenUrlUsecase.createTinyURL(
      request.url,
    );
    return { shortenedUrl };
  }
}
