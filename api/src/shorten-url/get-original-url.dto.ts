import { IsString, IsUrl } from 'class-validator';

export class GetOriginalUrlDto {
  @IsUrl()
  shortenedUrl: string;
}
