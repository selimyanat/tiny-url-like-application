export abstract class ShortenUrlRepository {
  abstract create(url: string, shortenedUrl: string): Promise<void>;

  abstract findOriginalURL(shortenedUrl: string): Promise<string | null>;
}
