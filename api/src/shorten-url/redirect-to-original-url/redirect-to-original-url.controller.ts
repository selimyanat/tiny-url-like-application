import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Redirect,
} from '@nestjs/common';
import { RedirectToOriginalUrlUsecase } from './redirect-to-original-url.usecase';

@Controller()
export class RedirectToOriginalUrlController {
  constructor(
    private readonly getOriginalUrlUsecase: RedirectToOriginalUrlUsecase,
  ) {}

  @Get(':slug')
  @Redirect(undefined, 302)
  async redirectToOriginalUrl(@Param('slug') slug: string) {
    const originalUrl = await this.getOriginalUrlUsecase.redirectToOriginalUrl(
      slug,
    );
    if (!originalUrl) {
      throw new NotFoundException(`Shortened URL "${slug}" not found`);
    }
    // Use temporary redirect to original URL so that we can capture analytics
    return { url: originalUrl };
  }
}
