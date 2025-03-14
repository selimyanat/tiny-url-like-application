export abstract class ShortenUrlRepository {
  abstract findURL(url: string): Promise<string | null>;

  abstract create(url: string, shortenedUrl: string): Promise<void>;
}
