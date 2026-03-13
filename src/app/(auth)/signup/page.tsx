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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-[400px] flex-col gap-6">
        {/* 로고 */}
        <div className="flex items-center gap-3">
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
          <Button variant="primary" type="submit" className="h-[56px] w-full">
            회원가입 하기
          </Button>
        </form>

        {/* 로그인 링크 */}
        <p className="text-center text-sm text-gray-500">
          이미 회원이신가요?{' '}
          <Link href="/login" className="font-medium text-[#FF8442] underline">
            로그인
          </Link>
        </p>

        {/* SNS 구분선 */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">SNS 계정으로 회원가입</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* SNS 버튼 */}
        <div className="flex justify-center gap-4">
          {/* 구글 */}
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">
            <Image src="/icons/google.png" alt="구글 로그인" width={24} height={24} />
          </button>
          {/* 깃허브 */}
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">
            <Image src="/icons/GitHub.png" alt="깃허브 로그인" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
