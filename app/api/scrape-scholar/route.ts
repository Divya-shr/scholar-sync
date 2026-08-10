import { NextResponse } from 'next/server';
import { scrapeScholarProfile } from '../../../lib/scholar/scraper';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body || {};

    if (!url || typeof url !== 'string' || !url.includes('scholar.google.com')) {
      return NextResponse.json({ error: 'Invalid Google Scholar URL' }, { status: 400 });
    }

    const data = await scrapeScholarProfile(url);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { name: 'Scholar User', citations: 'N/A', status: 'Fallback' },
      { status: 200 }
    );
  }
}