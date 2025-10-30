import { NextResponse } from 'next/server';
import { getBioContent, getTimelineContent, getThatBarContent, getPlotsContent } from '../../../../lib/content';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    let data;
    
    switch (type) {
      case 'bio':
        data = getBioContent();
        break;
      case 'timeline':
        data = getTimelineContent();
        break;
      case 'that-bar':
        data = getThatBarContent();
        break;
      case 'plots':
        data = getPlotsContent();
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading content:', error);
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}
