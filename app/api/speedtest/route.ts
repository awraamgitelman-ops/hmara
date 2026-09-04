import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'ping';

  // 1. Ping / Latency check
  if (action === 'ping') {
    return NextResponse.json(
      { status: 'ok', timestamp: Date.now() },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }

  // 2. Download throughput chunk (default 2MB, max 25MB)
  if (action === 'download') {
    const requestedBytes = parseInt(searchParams.get('bytes') || '2097152', 10);
    const size = Math.min(Math.max(requestedBytes, 65536), 26214400); // 64KB to 25MB
    const buffer = Buffer.alloc(size, 0xaa);

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': size.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }

  // 3. Client IP & Location info
  if (action === 'ip') {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    return NextResponse.json(
      {
        ip,
        location: 'Україна, Київ',
        provider: 'LIKEMARK CLOUD BGP Uplink (AS58291)',
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const startTime = Date.now();
    const arrayBuffer = await request.arrayBuffer();
    const durationMs = Date.now() - startTime;
    const receivedBytes = arrayBuffer.byteLength;

    return NextResponse.json(
      {
        status: 'ok',
        receivedBytes,
        durationMs,
        timestamp: Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to process upload', details: err.message },
      { status: 500 }
    );
  }
}
