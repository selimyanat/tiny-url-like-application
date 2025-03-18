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
    // TODO perhaps it is worth converting the URL from string to URL object
    const shortenedUrl = await this.shortenUrlUsecase.shortenUrl(request.url);
    return { shortenedUrl };
  }
}
