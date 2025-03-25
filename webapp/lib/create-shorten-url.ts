// Don't remove this line otherwise tests will fail
import fetch from 'node-fetch';

export async function createShortenUrl(url: string, baseUrl: string) {
  const response = await fetch(`${baseUrl}/shorten-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to shorten URL');
  }

  const data = await response.json();
  return data.shortenedUrl;
}
