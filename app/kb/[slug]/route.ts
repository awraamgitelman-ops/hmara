import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { renderPage } from '@/lib/renderPage';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug.replace(/\.html$/, '');
  const filePath = `public/kb/${slug}.html`;
  const fullPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath)) {
    return renderPage(filePath, 'kb');
  }

  return new NextResponse('Документацію не знайдено', { status: 404 });
}
