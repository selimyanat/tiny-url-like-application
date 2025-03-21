import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Redirect,
} from '@nestjs/common';
import { GetOriginalUrlUsecase } from './get-original-url.usecase';

@Controller()
export class GetOriginalUrlController {
  constructor(private readonly getOriginalUrlUsecase: GetOriginalUrlUsecase) {}

  @Get(':slug')
  @Redirect(undefined, 302)
  async getOriginalUrl(@Param('slug') slug: string) {
    const originalUrl = await this.getOriginalUrlUsecase.getOriginalUrl(slug);
    if (!originalUrl) {
      throw new NotFoundException(`Shortened URL "${slug}" not found`);
    }
    // Use temporary redirect to original URL so that we can capture analytics
    return { url: originalUrl };
  }
}
