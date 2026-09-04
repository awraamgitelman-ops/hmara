import { renderPage } from '@/lib/renderPage';

export async function GET() {
  return renderPage('public/datacenters.html', 'datacenters');
}
