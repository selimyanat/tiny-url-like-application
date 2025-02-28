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
  try {
    const response = await fetch('http://localhost:3001/shorten-url', {
      method: 'POST', // Use POST method
      headers: {
        'Content-Type': 'application/json', // Inform the server we are sending JSON
      },
      body: JSON.stringify({ url }), // Send URL in request body
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`Failed to shorten URL: ${response.statusText}`);
    }

    const data = await response.text(); // Assume server returns JSON
    console.log('URL shortened successfully:', data);
    return data; // Adjust this based on the API response structure
  } catch (error) {
    console.error('Error shortening URL:', error);
    throw error;
  }
}
