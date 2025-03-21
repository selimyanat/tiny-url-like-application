import { IsString, IsUrl } from 'class-validator';

export class CreateShortenUrlDto {
  @IsUrl()
  url: string;
}
