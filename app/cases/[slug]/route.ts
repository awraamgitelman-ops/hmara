import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const filePath = path.join(process.cwd(), 'public', 'cases', `${slug}.html`);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Case not found', { status: 404 });
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
