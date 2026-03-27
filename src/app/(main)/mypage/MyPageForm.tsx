'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import FormField from '@/shared/components/FormField';
import { userQueries } from '@/lib/queryKeys';
import { usePatchCurrentUser, usePatchCurrentUserPassword } from '@/lib/mutations';
import { validatePassword, validatePasswordConfirm } from '@/lib/validation';

export default function MyPageForm() {
  const { data: user } = useQuery(userQueries.current());
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState('');
  const [nicknameSuccess, setNicknameSuccess] = useState(false);

  const { mutate: patchUser, isPending: isPatchingUser } = usePatchCurrentUser();
  const { mutate: patchPassword, isPending: isPatchingPassword } = usePatchCurrentUserPassword();

  const isLocalLogin = user?.loginProvider === 'LOCAL';

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameSuccess(false);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setNewPasswordError(validatePassword(e.target.value));
    if (newPasswordConfirm) {
      setNewPasswordConfirmError(validatePasswordConfirm(e.target.value, newPasswordConfirm));
    }
  };

  const handleNewPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPasswordConfirm(e.target.value);
    setNewPasswordConfirmError(validatePasswordConfirm(newPassword, e.target.value));
  };

  const handleSave = () => {
    if (nickname && nickname !== user?.nickname) {
      patchUser(
        { nickname },
        {
          onSuccess: () => setNicknameSuccess(true),
        },
      );
    }

    if (isLocalLogin && currentPassword && newPassword && newPasswordConfirm) {
      const pwError = validatePassword(newPassword);
      const confirmError = validatePasswordConfirm(newPassword, newPasswordConfirm);

      if (pwError || confirmError) {
        if (pwError) setNewPasswordError(pwError);
        if (confirmError) setNewPasswordConfirmError(confirmError);
        return;
      }

      patchPassword(
        { currentPassword, newPassword, newPasswordConfirm },
        {
          onSuccess: () => {
            setCurrentPassword('');
            setNewPassword('');
            setNewPasswordConfirm('');
          },
        },
      );
    }
  };

  return (
    <div className="flex w-[400px] flex-col gap-6 rounded-2xl bg-white p-8">
      {/* 프로필 이미지 */}
      <div className="flex justify-center">
        <div className="relative">
          <Image
            src={user?.profileImageUrl ?? '/icons/image.png'}
            alt="프로필"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <button className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8442]">
            <span className="text-xs text-white">✎</span>
          </button>
        </div>
      </div>

      {/* 이메일 */}
      <FormField label="이메일">
        <Input type="email" value={user?.email ?? ''} disabled />
      </FormField>

      {/* 닉네임 */}
      <FormField label="닉네임">
        <Input type="text" value={nickname} onChange={handleNicknameChange} placeholder="닉네임을 입력해주세요" />
        {nicknameSuccess && <p className="px-1 text-sm text-[#0CAF60]">사용 가능한 닉네임입니다.</p>}
      </FormField>

      {/* 비밀번호 변경 - 소셜 로그인이면 숨김 */}
      {isLocalLogin && (
        <FormField label="비밀번호 변경">
          <div className="flex flex-col gap-2">
            <Input
              type="password"
              placeholder="현재 비밀번호를 입력해주세요"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="새 비밀번호를 입력해주세요"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className={newPasswordError ? 'border-red-500' : ''}
            />
            {newPasswordError && <p className="px-1 text-sm text-red-500">{newPasswordError}</p>}
            <Input
              type="password"
              placeholder="새 비밀번호를 다시 입력해주세요"
              value={newPasswordConfirm}
              onChange={handleNewPasswordConfirmChange}
              className={newPasswordConfirmError ? 'border-red-500' : ''}
            />
            {newPasswordConfirmError && <p className="px-1 text-sm text-red-500">{newPasswordConfirmError}</p>}
          </div>
        </FormField>
      )}

      {/* 저장하기 버튼 */}
      <Button
        variant="primary"
        type="button"
        className="h-14 w-full"
        onClick={handleSave}
        disabled={isPatchingUser || isPatchingPassword}
      >
        저장하기
      </Button>
    </div>
  );
}
