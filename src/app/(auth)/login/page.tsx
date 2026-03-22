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

      if (!res.ok) {
        const data = await res.json();
        alert(data.message);
        return;
      }

      const data = await res.json();

      localStorage.setItem('accessToken', data.accessToken);

      router.push('/'); // 로그인 후 이동
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F5F5]">
      <div className="flex w-full max-w-[360px] flex-col items-start">
        {/* 로고 */}
        <div className="mb-8 flex h-12 w-100 items-center gap-4">
          <Image src="/icons/todo.png" alt="logo" width={48} height={48} />
          <span className="text-2xl font-bold">Slid to-do</span>
        </div>
        <div className="flex flex-col gap-4">
          {/* 이메일 */}
          <FormField label="">
            <Input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
          {/* 비밀번호 */}
          <FormField label="">
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
        </div>
        {/* 로그인 버튼 */}
        <div className="mt-8 w-full">
          <Button onClick={handleLogin} className="h-14 w-100">
            로그인하기
          </Button>
        </div>
        {/* 회원가입 링크 */}
        <div className="mt-6 flex h-6 w-100 items-center justify-center gap-1 text-sm">
          <span className="text-base font-medium leading-6 text-[#333333]">슬리드투두가 처음이신가요?</span>
          <a href="/signup" className="text-base font-semibold leading-6 text-[#EF6C00]">
            회원가입
          </a>
        </div>
        {/* SNS 구분선 */}
        <div className="mb-4 mt-10 flex w-100 items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">SNS 계정으로 로그인</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        {/* SNS 버튼 */}
        <div className="flex w-100 justify-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">
            <Image src="/icons/google.png" alt="구글 로그인" width={24} height={24} />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">
            <Image src="/icons/GitHub.png" alt="깃허브 로그인" width={24} height={24} />
          </button>
        </div>
      </div>
    </main>
  );
}
