import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateShortenUrlUsecase } from './create-shorten-url.usecase';
import { CreateShortenUrlDto } from './create-shorten-url.dto';

@Controller('/shorten-url')
export class CreateShortenUrlController {
  constructor(private readonly shortenUrlUsecase: CreateShortenUrlUsecase) {}

  @Post()
  async shortenUrl(
    @Body() request: CreateShortenUrlDto,
  ): Promise<{ shortenedUrl: string }> {
    // TODO perhaps it is worth converting the URL from string to URL object
    const shortenedUrl = await this.shortenUrlUsecase.shortenUrl(request.url);
    return { shortenedUrl };
  }
}
