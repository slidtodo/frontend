'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import FormField from '@/shared/components/FormField';
import { validateEmail, validatePassword, validatePasswordConfirm } from '@/lib/validation';
import { fetchAuth } from '@/lib/api/fetchAuth';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  // TODO: 리액트쿼리로 변경 필요, 리액트 훅 폼 적용 필요
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const passwordConfirmErr = validatePasswordConfirm(password, passwordConfirm);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setPasswordConfirmError(passwordConfirmErr);
    if (emailErr || passwordErr || passwordConfirmErr) return;

    try {
      await fetchAuth.postSignup({ nickname: name, email, password });

      alert('회원가입 성공!');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleGithubLogin = async () => {
    const data = await fetchAuth.getGithubAuthorizeUrl();
    if (data.loginUrl) window.location.href = data.loginUrl;
  };

  const handleGoogleLogin = async () => {
    const data = await fetchAuth.getGoogleAuthorizeUrl();
    if (data.loginUrl) window.location.href = data.loginUrl;
  };

  return (
    <main className="flex min-h-screen items-center justify-center py-20">
      <div className="flex w-full max-w-[331px] flex-col items-start md:max-w-[400px]">
        {/* 로고 */}
        <div className="mb-10 flex h-12 w-full items-center gap-4">
          <Image src="/icons/todo.png" alt="logo" width={48} height={48} />
          <span className="text-2xl font-bold">Bearlog</span>
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
          <FormField label="이메일" error={emailError}>
            <Input
              type="text"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
            />
          </FormField>

          {/* 비밀번호 */}
          <FormField label="비밀번호" error={passwordError}>
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
            />
          </FormField>
          <FormField label="비밀번호 확인" error={passwordConfirmError}>
            <Input
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setPasswordConfirmError('');
              }}
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
          <span className="text-base leading-6 font-medium text-gray-700">이미 회원이신가요?</span>
          <Link href="/login" className="text-bearlog-600 text-base leading-6 font-semibold">
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
