import { NextRequest, NextResponse } from 'next/server';
import { createShortenUrl } from '../../../lib/create-shorten-url';

export async function POST(request: NextRequest) {
  const { url } = await request.json().catch(() => ({})); // ✅ Simplified JSON parsing

  if (typeof url !== 'string' || !url.trim()) {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  try {
    const shortenedUrl = await createShortenUrl(url, 'http://localhost:3000');
    return NextResponse.json({ shortenedUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  /*
  return fetch('http://localhost:3000/shorten-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
    .then(async (res) => {
      if (!res.ok)
        throw new Error((await res.json()).error || 'Failed to shorten URL');
      return res.json();
    })
    .then((data) =>
      NextResponse.json({ shortenedUrl: data.shortenedUrl }, { status: 200 })
    )
    .catch((error) => {
      console.error('Error shortening URL:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    });
    */
}
