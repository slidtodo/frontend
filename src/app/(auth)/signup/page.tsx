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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-[400px] flex flex-col gap-6">
        {/* 로고 */}
        <div className="flex items-center gap-3">
          <Image src="/icons/todo.png" alt="Slid to-do" width={40} height={40} />
          <span className="text-2xl font-bold text-gray-900">Slid to-do</span>
        </div>

        {/* 폼 */}
        <div className="flex flex-col gap-4">
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
        </div>

        {/* 회원가입 버튼 */}
        <Button variant="primary" type="submit" className="w-full h-[56px]">
          회원가입 하기
        </Button>

        {/* 로그인 링크 */}
        <p className="text-center text-sm text-gray-500">
          이미 회원이신가요?{' '}
          <Link href="/login" className="text-[#FF8442] font-medium underline">
            로그인
          </Link>
        </p>

        {/* SNS 구분선 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">SNS 계정으로 회원가입</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* SNS 버튼 */}
        <div className="flex justify-center gap-4">
          {/* 구글 */}
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <Image src="/icons/google.png" alt="구글 로그인" width={24} height={24} />
          </button>
          {/* 깃허브 */}
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <Image src="/icons/GitHub.png" alt="깃허브 로그인" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
