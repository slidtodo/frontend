import { NextResponse } from 'next/server';

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

const readCookieValue = (setCookieHeader: string, cookieName: string) => {
  const match = setCookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
  return match?.[1];
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const setCookieHeader = response.headers.get('set-cookie') ?? '';
  const accessToken = readCookieValue(setCookieHeader, 'accessToken');
  const refreshToken = readCookieValue(setCookieHeader, 'refreshToken');

  console.log('accessToken', accessToken);
  const nextResponse = NextResponse.json({ ok: true });

  if (accessToken) {
    nextResponse.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 14, // TODO: 임시적으로 14분으로 설정 (accessToken의 유효기간에 맞춰 조정 필요)
    });
  }
  if (refreshToken) {
    nextResponse.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 59,
    });
  }

  return nextResponse;
}

/**
 * 백엔드에서 바디로 토큰 보내주기
 * 우리는 api 호출할 때 route, server actions를 거쳐서 백엔드 api 호출
 * 백엔드에서는 authorization 헤더에 넣어서 보내야함
 * headers cookie가 아니고 authorization 헤더로 bearer 토큰을 보내야함
 *
 * 지금 우리 방식의 (전) 단점
 * 굳이 백 쿠키를 강제로 훔치고 api 호출할 때도 강제로 쿠리를 넣어서 보내야 함
 * -> 문제는 없는데; 논리적으로 좀 이상함 (쿠키로 하는데 왜 쿠키로 또 저장함 ㅇㅅㅇ?)
 *
 * 지금 우리 방식의 (전) 장점
 * 무조건 route 핸들러를 거쳐서 보내야 한다라는 귀찮음이 있음.
 * -> 근데 클라이언트 컴포넌트에서도 백엔드 요청 ㄱㄴ, 서버도 바로 요청 ㄱㄴ
 *
 * 우리가 하는 방식 (후) 단점
 * 매번 서버 측에서 쿠키를 꺼내서 인증해야함 authentication에 넣어서 보낸다. (서버 유틸 함수에서 처리)
 *
 * 우리가 하는 방식 (후) 장점
 * 클라이언트, 서버 컴포넌트 다 가능하지만 route 핸들러 거쳐서 가야함. 두개 다리 건너야함
 *
 *
 * mdn 쿠키를 다시 읽어보자...
 *
 * 넥스트 js와 외부백엔드에서 인증 서비스가 있는 api 이 두개가 있을 때 BFF를 어떻게 구현하는지
 * 고려: 서버컴포넌트 + 토큰 + 클라이언트
 *
 * 외부백엔드에서 바디로 주고
 * 우리는 그걸 쿠키로 넣어준다.
 */
