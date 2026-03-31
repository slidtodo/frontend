import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('url 파라미터가 필요합니다', { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch {
    return new NextResponse('유효하지 않은 URL입니다', { status: 400 });
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
    },
    signal: AbortSignal.timeout(8000),
  });

  const contentType = response.headers.get('content-type') ?? 'text/html';

  // HTML이 아닌 경우(이미지, PDF 등) 그대로 스트리밍
  if (!contentType.includes('text/html')) {
    const headers = new Headers({ 'content-type': contentType });
    return new NextResponse(response.body, { status: response.status, headers });
  }

  const html = await response.text();
  const origin = targetUrl.origin;

  // <base href> 주입으로 상대경로 리소스 해결
  const patched = html.replace(
    /(<head[^>]*>)/i,
    `$1<base href="${origin}/">`,
  );

  const headers = new Headers({
    'content-type': 'text/html; charset=utf-8',
    // 프레임 차단 헤더 제거 (설정하지 않음)
    'cache-control': 'no-store',
  });

  return new NextResponse(patched, { status: 200, headers });
}
