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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await fetch('/api/proxy/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname: name }),
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

  const handleGithubLogin = async () => {
    const res = await fetch('/api/proxy/api/v1/auth/oauth/github/url');
    const data = await res.json();
    window.location.href = data.loginUrl;
  };

  const handleGoogleLogin = async () => {
    const res = await fetch('/api/proxy/api/v1/auth/oauth/google/url');
    const data = await res.json();
    window.location.href = data.loginUrl;
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-50 pt-[158px]">
      <div className="flex w-[400px] flex-col">
        <div className="mb-12 flex items-center gap-3">
          <Image src="/icons/todo.png" alt="Slid to-do" width={40} height={40} />
          <span className="text-2xl font-bold text-gray-900">Slid to-do</span>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          <Button variant="primary" type="submit" className="mt-4 h-[56px] w-full">
            회원가입 하기
          </Button>
        </form>

        <div className="mt-6 flex h-6 items-center justify-center gap-1">
          <span className="text-base leading-6 font-medium text-[#333333]">이미 회원이신가요?</span>
          <Link href="/login" className="text-base leading-6 font-semibold text-[#EF6C00]">
            로그인
          </Link>
        </div>

        <div className="mt-[40px] flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">SNS 계정으로 회원가입</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <button onClick={handleGoogleLogin}>
            <Image src="/icons/google.png" alt="구글 로그인" width={56} height={56} />
          </button>
          <button onClick={handleGithubLogin}>
            <Image src="/icons/GitHub.png" alt="깃허브 로그인" width={56} height={56} />
          </button>
        </div>
      </div>
    </div>
  );
}
