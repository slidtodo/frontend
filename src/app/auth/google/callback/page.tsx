'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAuth } from '@/lib/api/fetchAuth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.push('/login');
      return;
    }

    const login = async () => {
      try {
        await fetchAuth.postGoogleLogin({ code });
        router.push('/dashboard');
      } catch (error) {
        console.error('구글 로그인 콜백 실패:', error);
        router.push('/login');
      }
    };

    login();
  }, [searchParams, router]);

  return <div>로그인 중...</div>;
}
