export abstract class ShortenUrlRepository {
  abstract findShortenedURL(url: string): Promise<string | null>;

  abstract create(url: string, shortenedUrl: string): Promise<void>;

  abstract findOriginalURL(shortenedUrl: string): Promise<string | null>;
}
