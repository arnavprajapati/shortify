import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { connectToDB } from '@/lib/db';
import Url from '@/models/url';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetUrl = body.url || body.redirectUrl;
    const customAlias = body.customAlias || body.alias;

    if (!targetUrl || typeof targetUrl !== 'string' || targetUrl.trim() === '') {
      return NextResponse.json(
        { message: 'redirectUrl is required' },
        { status: 400 }
      );
    }

    const trimmedUrl = targetUrl.trim();
    const formattedUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;

    await connectToDB();

    let shortId = '';

    if (customAlias && typeof customAlias === 'string' && customAlias.trim() !== '') {
      const cleanAlias = customAlias.trim();

      const validPattern = /^[a-zA-Z0-9_-]{2,30}$/;
      if (!validPattern.test(cleanAlias)) {
        return NextResponse.json(
          { message: 'Custom alias must be 2-30 characters (letters, numbers, hyphens, underscores only).' },
          { status: 400 }
        );
      }

      if (['api', 'favicon.ico', '_next'].includes(cleanAlias.toLowerCase())) {
        return NextResponse.json(
          { message: 'This custom alias is reserved. Please pick another.' },
          { status: 400 }
        );
      }

      const existing = await Url.findOne({ shortId: cleanAlias });
      if (existing) {
        return NextResponse.json(
          { message: 'This custom alias is already taken. Please choose another.' },
          { status: 409 }
        );
      }

      shortId = cleanAlias;
    } else {
      shortId = nanoid(5);
    }

    const newEntry = await Url.create({
      shortId,
      redirectUrl: formattedUrl,
      count: 0,
      visitHistory: [],
    });

    const host = req.headers.get('host') || 'localhost:3009';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const shortUrl = `${protocol}://${host}/${shortId}`;

    return NextResponse.json(
      {
        id: shortId,
        shortUrl,
        redirectUrl: newEntry.redirectUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating short URL:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
