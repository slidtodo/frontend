'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import FormField from '@/shared/components/FormField';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <div className="flex min-h-screen justify-center bg-gray-50 pt-[158px]">
      <div className="flex w-[400px] flex-col">
        {/* 로고 */}
        <div className="mb-12 flex items-center gap-3">
          <Image src="/icons/todo.png" alt="Slid to-do" width={40} height={40} />
          <span className="text-2xl font-bold text-gray-900">Slid to-do</span>
        </div>

        {/* 폼 */}
        <form className="flex flex-col gap-4" onSubmit={() => {}}>
          <FormField label="이름">
            <Input
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField label="이메일">
            <Input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

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

          {/* 회원가입 버튼 */}
          <Button variant="primary" type="submit" className="mt-4 h-[56px] w-full">
            회원가입 하기
          </Button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 flex h-6 items-center justify-center gap-1">
          <span className="text-base font-medium leading-6 text-[#333333]">이미 회원이신가요?</span>
          <Link href="/login" className="text-base font-semibold leading-6 text-[#EF6C00]">
            로그인
          </Link>
        </div>

        {/* SNS 구분선 */}
        <div className="mt-[40px] flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">SNS 계정으로 회원가입</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* SNS 버튼 */}
        <div className="mt-4 flex justify-center gap-4">
          {/* 구글 */}
          <button>
            <Image src="/icons/google.png" alt="구글 로그인" width={56} height={56} />
          </button>
          {/* 깃허브 */}
          <button>
            <Image src="/icons/GitHub.png" alt="깃허브 로그인" width={56} height={56} />
          </button>
        </div>
      </div>
    </div>
  );
}
