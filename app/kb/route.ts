import { NextResponse } from 'next/server';
import { renderPage } from '@/lib/renderPage';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = 'public/kb/cloud-vps.html';
  if (fs.existsSync(path.join(process.cwd(), filePath))) {
    return renderPage(filePath, 'kb');
  }
  return new NextResponse('Knowledge Base Index', { status: 200 });
}
