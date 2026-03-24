'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import FormField from '@/shared/components/FormField';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // TODO: 리액트쿼리로 변경 필요, 리액트 훅 폼 적용 필요
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        alert('회원가입 성공!');
        router.push('/login');
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
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
        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <FormField label="이름">
            <Input
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          {/* 이메일 */}
          <FormField label="이메일">
            <Input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <FormField label="비밀번호 확인">
            <Input
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </FormField>
          <Button
            type="submit"
            className="mt-8 h-14 w-full"
            disabled={!name || !email || !password || !passwordConfirm}
          >
            회원가입하기
          </Button>
        </form>
        {/* 회원가입 버튼 */}

        {/* 로그인 링크 */}
        <div className="mt-6 flex h-6 w-full items-center justify-center gap-2 text-sm">
          <span className="text-base leading-6 font-medium text-[#333333]">이미 회원이신가요?</span>
          <Link href="/login" className="text-base leading-6 font-semibold text-[#EF6C00]">
            로그인
          </Link>
        </div>
        {/* SNS 구분선 */}
        <div className="mt-10 mb-4 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">SNS 계정으로 회원가입</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        {/* SNS 버튼 */}
        <div className="flex w-full justify-center gap-4">
          <button
            type="button"
            onClick={() => alert('구글 로그인')}
            aria-label="구글 로그인"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[#DDDDDD] bg-white p-4 hover:bg-gray-50"
          >
            <Image src="/icons/google-icon.png" alt="구글 아이콘" width={24} height={24} />
          </button>
          <button
            type="button"
            onClick={() => alert('깃허브 로그인')}
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
