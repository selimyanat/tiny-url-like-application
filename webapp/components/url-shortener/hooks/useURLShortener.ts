import { useState } from 'react';
import { shortenURL } from '../services/url-shorten-service';

export const useURLShortener = () => {
  const shorten = async () => {
    if (!longUrl) {
      setError('Please enter a URL');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const shortenedUrl = await shortenURL(longUrl);
      setShortUrl(shortenedUrl);
      setMode('shortened');
    } catch (error) {
      setError('An error occurred while shortening the URL');
      console.error('An error occurred while shortening the URL', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLongUrl('');
    setShortUrl(null);
    setMode('initial');
  };

  const [longUrl, setLongUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'initial' | 'shortened'>('initial');

  return {
    longUrl,
    setLongUrl,
    shortUrl,
    loading,
    error,
    shorten,
    mode,
    reset,
  };
};
