'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAuth } from '@/shared/lib/api/fetchAuth';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

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
        await fetchAuth.postGithubLoginByEnv({ code });
        router.push('/dashboard');
      } catch (error) {
        console.error('GitHub login callback failed:', error);
        router.push('/login');
      }
    };

    login();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner className="bg-bearlog-500" />
    </div>
  );
}
