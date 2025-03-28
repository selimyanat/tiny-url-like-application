import { NextRequest, NextResponse } from 'next/server';
import { createShortenUrl } from '../../../lib/create-shorten-url';

export async function POST(request: NextRequest) {
  const { url } = await request.json().catch(() => ({})); //

  if (typeof url !== 'string' || !url.trim()) {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  try {
    const shortenedBaseUrl = process.env.SHORTENED_BASE_URL;

    if (!shortenedBaseUrl) {
      throw new Error('SHORTENED_BASE_URL not configured');
    }
    const shortenedUrl = await createShortenUrl(url, shortenedBaseUrl);
    return NextResponse.json({ shortenedUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
