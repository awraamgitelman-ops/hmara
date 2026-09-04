import { renderPage } from '@/lib/renderPage';

export async function GET() {
  return renderPage('public/privacy.html', '');
}
