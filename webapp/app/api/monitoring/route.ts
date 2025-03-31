import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiBaseUrl = process.env.SHORTENED_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL not configured');
    }
    const pingResponse = await fetch(`${apiBaseUrl}/ping`);
    const data = await pingResponse.json();
    if (data.status === 'ok') {
      return NextResponse.json({ ready: true }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
