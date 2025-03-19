import { Body, Controller, Get } from '@nestjs/common';
import { GetOriginalUrlDto } from './get-original-url.dto';
import { ShortenUrlUsecase } from './shorten-url.usecase';
import { GetOriginalUrlUsecase } from './get-original-url.usecase';

@Controller('/shorten-url')
export class GetOriginalUrlController {
  constructor(private readonly getOriginalUrlUsecase: GetOriginalUrlUsecase) {}

  @Get()
  async getOriginalUrl(
    @Body() request: GetOriginalUrlDto,
  ): Promise<{ originalUrl: string }> {
    const originalUrl = await this.getOriginalUrlUsecase.getOriginalUrl(
      request.shortenedUrl,
    );
    return { originalUrl };
  }
}
