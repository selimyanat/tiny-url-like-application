export const shortenURL = async (longUrl: string): Promise<string> => {
  const response = await fetch('/api/shortened-urls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: longUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to shorten URL');
  }

  const data = await response.json();
  return data.shortenedUrl;
};
