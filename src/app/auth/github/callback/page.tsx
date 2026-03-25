'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GithubCallbackPage() {
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
        const res = await fetch('/api/proxy/api/v1/auth/oauth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        router.push('/dashboard');
      } catch {
        router.push('/login');
      }
    };

    login();
  }, [searchParams, router]);

  return <div>로그인 중...</div>;
}
