'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/shared/components/FormField';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      localStorage.setItem('accessToken', data.accessToken);

      router.push('/'); // 로그인 후 이동
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F5F5]">
      <div className="flex w-full max-w-[360px] flex-col items-center">
        {/* 로고 */}
        <div className="mb-8 flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={24} height={24} />
          <span className="text-lg font-semibold">Slid to-do</span>
        </div>

        {/* 이메일 */}
        <FormField label="" required>
          <Input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>

        {/* 비밀번호 */}
        <FormField label="" required>
          <Input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>

        {/* 로그인 버튼 */}
        <div className="mt-4 w-full">
          <Button onClick={handleLogin} className="w-full">
            로그인하기
          </Button>
        </div>

        {/* 구분선 */}
        <div className="my-6 w-full border-t border-gray-200" />

        {/* 소셜 로그인 */}
        <div className="flex items-center gap-4">
          <Image src="/google.png" alt="google" width={32} height={32} />
          <Image src="/github.png" alt="github" width={32} height={32} />
        </div>
      </div>
    </main>
  );
}
