import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Url from '@/models/url';

export async function GET(
  req: NextRequest,
  { params }: { params: { shortUrl: string } }
) {
  const shortUrl = params.shortUrl;

  if (shortUrl === 'favicon.ico') {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await connectToDB();
    const url = await Url.findOne({ shortId: shortUrl });

    if (!url) {
      return new NextResponse('Short URL not found', { status: 404 });
    }

    await Url.findByIdAndUpdate(url._id, {
      $inc: { count: 1 },
      $push: { visitHistory: { timestamp: Date.now() } },
    });

    return NextResponse.redirect(url.redirectUrl, 302);
  } catch (error) {
    console.error('Redirection error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
