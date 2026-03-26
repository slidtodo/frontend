'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import FormField from '@/shared/components/FormField';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import Image from 'next/image';
import { postLogin, getGithubAuthorizeUrl, getGoogleAuthorizeUrl } from '@/lib/api/fetchAuth';
import { validateEmail } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const data = await getGoogleAuthorizeUrl();
      if (data.loginUrl) window.location.href = data.loginUrl;
    } catch (error) {
      console.error(error);
      alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleGithubLogin = async () => {
    try {
      const data = await getGithubAuthorizeUrl();
      if (data.loginUrl) window.location.href = data.loginUrl;
    } catch (error) {
      console.error(error);
      alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // TODO: 리액트쿼리로 변경 필요, 리액트 훅 폼 적용 필요.
  const handleLogin = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    try {
      await postLogin({ email, password });

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F5F5] py-20">
      <div className="flex w-full max-w-[331px] flex-col items-start md:max-w-[400px]">
        {/* 로고 */}
        <div className="mb-10 flex h-12 w-full items-center gap-4">
          <Image src="/icons/todo.png" alt="logo" width={48} height={48} />
          <span className="text-2xl font-bold">Slid to-do</span>
        </div>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* 이메일 */}
          <FormField label="이메일" error={emailError}>
            <Input
              type="text"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            />
          </FormField>
          {/* 비밀번호 */}
          <FormField label="비밀번호">
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
          <Button type="submit" className="mt-8 h-14 w-full" disabled={!email || !password}>
            로그인하기
          </Button>
        </form>
        {/* 로그인 버튼 */}

        {/* 회원가입 링크 */}
        <div className="mt-6 flex h-6 w-full items-center justify-center gap-2 text-sm">
          <span className="text-base leading-6 font-medium text-[#333333]">슬리드투두가 처음이신가요?</span>
          <Link href="/signup" className="text-base leading-6 font-semibold text-[#EF6C00]">
            회원가입
          </Link>
        </div>
        {/* SNS 구분선 */}
        <div className="mt-10 mb-4 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">SNS 계정으로 로그인</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        {/* SNS 버튼 */}
        <div className="flex w-full justify-center gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            aria-label="구글 로그인"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[#DDDDDD] bg-white p-4 hover:bg-gray-50"
          >
            <Image src="/icons/google-icon.png" alt="구글 아이콘" width={24} height={24} />
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            aria-label="깃허브 로그인"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[#DDDDDD] bg-white p-4 hover:bg-gray-50"
          >
            <Image src="/icons/GitHub.png" alt="깃허브 아이콘" width={24} height={24} />
          </button>
        </div>
      </div>
    </main>
  );
}
