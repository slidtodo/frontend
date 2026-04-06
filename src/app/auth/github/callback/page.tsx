'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAuth } from '@/shared/lib/api/fetchAuth';

export default function GithubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.push('/login');
      return;
    }

    const isDev = process.env.NEXT_PUBLIC_USE_DEV_API === 'true';

    const login = async () => {
      try {
        isDev
          ? await fetchAuth.postDevGithubLogin({ code })
          : await fetchAuth.postGithubLogin({ code });
        router.push('/dashboard');
      } catch (error) {
        console.error('GitHub login callback failed:', error);
        router.push('/login');
      }
    };

    login();
  }, [searchParams, router]);

  return <div>로그인 중...</div>;
}
