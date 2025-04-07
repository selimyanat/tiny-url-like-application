import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { CreateShortenUrlUsecase } from './create-shorten-url.usecase';
import { CreateShortenUrlDto } from './create-shorten-url.dto';

@Controller('/shortened-urls')
export class CreateShortenUrlController {
  constructor(private readonly shortenUrlUsecase: CreateShortenUrlUsecase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async shortenUrl(
    @Body() request: CreateShortenUrlDto,
  ): Promise<{ shortenedUrl: string }> {
    // TODO perhaps it is worth converting the URL from string to URL object
    const url = new URL(request.url);
    const shortenedUrl = await this.shortenUrlUsecase.shortenUrl(url);
    return { shortenedUrl: shortenedUrl.toString() };
  }
}
