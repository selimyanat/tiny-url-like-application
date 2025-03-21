export abstract class ShortenUrlRepository {
  abstract create(url: string, encodedUrl: string): Promise<void>;

  abstract findOriginalURL(encodedUrl: string): Promise<string | null>;
}
