'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import PageHeader from '@/shared/components/PageHeader';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import FormField from '@/shared/components/FormField';

import { userQueries } from '@/shared/lib/query/queryKeys';
import { usePatchCurrentUser, usePatchCurrentUserPassword } from '@/shared/lib/query/mutations';
import { validatePassword, validatePasswordConfirm } from '@/shared/lib/validation';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { useModalStore } from '@/shared/stores/useModalStore';
import { useToastStore } from '@/shared/stores/useToastStore';
import { PopupModal } from '@/shared/components/Modal/PopupModal';
import { fetchUsers } from '@/shared/lib/api/fetchUsers';
import { fetchImages } from '@/shared/lib/api/fetchImages';

// TODO: 리액트 훅 폼 적용 필요
export default function MyPageForm() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

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
  const { openModal } = useModalStore();
  const { showToast } = useToastStore();

  const isLocalLogin = user?.loginProvider === 'LOCAL';
  const isGithubConnected = user?.loginProvider === 'GITHUB';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { uploadUrl, url } = await fetchImages.postImageUploadUrl({ fileName: file.name });
      await fetch(uploadUrl, { method: 'PUT', body: file });
      patchUser({ profileImageUrl: url });
    } catch {
      showToast('이미지 업로드에 실패했습니다. 다시 시도해주세요.', 'fail');
    }
  };

  const handleGithubDisconnect = () => {
    openModal(
      <PopupModal
        variant={{ type: 'githubDisconnect' }}
        onConfirm={() => {
          // TODO: GitHub 연결 해제 API 연동 필요
        }}
      />,
    );
  };

  const handleAccountDelete = () => {
    openModal(
      <PopupModal
        variant={{ type: 'accountDelete', isLocalUser: isLocalLogin }}
        onConfirm={async (password) => {
          try {
            await fetchUsers.deleteCurrentUser(password ? { password } : undefined);
            window.location.href = '/login';
          } catch {
            showToast('회원 탈퇴에 실패했습니다. 다시 시도해주세요.', 'fail');
          }
        }}
      />,
    );
  };

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
    <div className="flex flex-col gap-10">
      {!isMobile && <PageHeader title="내 정보 관리" />}

      <div className="flex min-h-219.5 w-140 flex-col gap-6 rounded-2xl bg-white p-8">
        {/* 프로필 이미지 */}
        <div className="flex justify-center">
          <div className="relative h-33 w-33">
            <div className="h-full w-full overflow-hidden rounded-full bg-[#C8EDEA]">
              <Image
                src={user?.profileImageUrl ?? '/image/default-profile.png'}
                alt="프로필"
                width={132}
                height={132}
                className="h-full w-full object-cover"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-0 bottom-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#00C87F]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
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

        {/* 저장하기 / 회원 탈퇴 버튼 */}
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            type="button"
            className="h-14 w-full"
            onClick={handleSave}
            disabled={isPatchingUser || isPatchingPassword}
          >
            저장하기
          </Button>

          <button
            type="button"
            onClick={handleAccountDelete}
            className="h-14 w-full rounded-full bg-gray-100 text-sm font-medium text-gray-500 hover:bg-gray-200"
          >
            회원 탈퇴하기
          </button>
        </div>

        {/* GitHub 연동 */}
        {isGithubConnected && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Github 연동</span>
              <span className="h-2 w-2 rounded-full bg-[#00C87F]" />
              <span className="text-sm text-gray-500">연결됨</span>
            </div>
            <button
              type="button"
              onClick={handleGithubDisconnect}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
            >
              연결 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
