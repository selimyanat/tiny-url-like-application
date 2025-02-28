import { NextRequest, NextResponse } from 'next/server';

// Function to handle POST requests
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    const shortenedUrl = await shortenUrl(url);
    return NextResponse.json({ shortenedUrl }, { status: 200 });
  } catch (error) {
    // Handle errors and return a 400 status with an error message
    console.error('Failed to shorten URL:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Example function to simulate URL shortening logic
async function shortenUrl(url: string): Promise<string> {
  // Replace this with your actual URL shortening implementation
  // call an http service, generate a random string, etc
  const response = await fetch('http://localhost:3001');
  if (!response.ok) {
    throw new Error('Failed to shorten URL');
  }
  const data = await response.text();
  console.log('URL shortened successfully:' + data);
  return data as string;
}
