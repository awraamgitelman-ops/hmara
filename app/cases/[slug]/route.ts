import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { renderPage } from '@/lib/renderPage';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug.replace(/\.html$/, '');
  const filePath = `public/cases/${slug}.html`;
  const fullPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath)) {
    return renderPage(filePath, 'cases');
  }

  return new NextResponse('Case not found', { status: 404 });
}
