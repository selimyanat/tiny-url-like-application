import { NextRequest, NextResponse } from 'next/server';

// Function to handle POST requests
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      throw new Error(`Invalid URL format ${url}`);
    }

    const shortenedUrl = await shortenUrl(url);
    return NextResponse.json({ shortenedUrl }, { status: 200 });
  } catch (error) {
    console.error('Failed to shorten URL:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid request' },
      { status: 400 }
    );
  }
}

// Function to call the backend API
async function shortenUrl(url: string): Promise<string> {
  try {
    const requestBody = { url };
    const response = await fetch('http://localhost:3000/shorten-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to shorten URL');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    throw error;
  }
}
