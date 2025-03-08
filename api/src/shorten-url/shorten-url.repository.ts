export interface ShortenUrlRepository {
  findURL(url: string): Promise<string | null>;

  create(url: string, shortenedUrl: string): Promise<void>;
}
