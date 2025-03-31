import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiBaseUrl = process.env.SHORTENED_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL not configured');
    }
    const pingResponse = await fetch(`${apiBaseUrl}/monitoring/ping`);
    const data = await pingResponse.json();
    if (data.status === 'OK') {
      return NextResponse.json({ status: 'OK' }, { status: 200 });
    } else {
      console.log(data);
      return NextResponse.json(
        { error: data.message },
        { status: data.status }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
