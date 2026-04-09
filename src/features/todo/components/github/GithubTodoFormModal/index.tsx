'use client';

import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import Button from '@/shared/components/Button';
import FormField from '@/shared/components/FormField';
import Input from '@/shared/components/Input';
import DateInput from '@/features/todo/components/manual/shared/DateInput';

import { ApiError, PostTodoRequest } from '@/shared/lib/api';
import { usePostTodo } from '@/shared/lib/query/mutations';
import { useModalStore } from '@/shared/stores/useModalStore';
import { formatDateForAPI } from '@/shared/utils/utils';

type GithubTodoSource = 'GITHUB_ISSUE' | 'GITHUB_PR';

interface GithubTodoFormModalProps {
  goalId: number;
  goalTitle?: string;
}

type GithubTodoFormValues = {
  title: string;
  dueDate?: string;
  source: GithubTodoSource;
  headBranch?: string;
  baseBranch?: string;
};

const SOURCE_OPTIONS: { label: string; value: GithubTodoSource; description: string }[] = [
  {
    label: 'GitHub Issue',
    value: 'GITHUB_ISSUE',
    description: '할 일과 연결된 GitHub Issue를 생성합니다',
  },
  {
    label: 'GitHub PR',
    value: 'GITHUB_PR',
    description: '브랜치 생성 후 Pull Request를 생성합니다',
  },
];

export default function GithubTodoFormModal({ goalId, goalTitle }: GithubTodoFormModalProps) {
  const { closeModal } = useModalStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<GithubTodoFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      dueDate: undefined,
      source: 'GITHUB_ISSUE',
      headBranch: '',
      baseBranch: '',
    },
  });

  register('dueDate', { required: '마감기한은 필수입니다.' });

  const dueDate = useWatch({ control, name: 'dueDate' });
  const source = useWatch({ control, name: 'source' });

  const selectedDate = dueDate ? new Date(dueDate) : undefined;
  const isPR = source === 'GITHUB_PR';

  const postTodoMutation = usePostTodo();
  const isSubmitting = postTodoMutation.isPending;

  const onSubmit = async (data: GithubTodoFormValues) => {
    setSubmitError(null);

    try {
      const body: PostTodoRequest = {
        title: data.title,
        goalId,
        dueDate: data.dueDate,
        source: data.source,
        linkUrl: undefined,
        imageUrl: undefined,
        tags: [],
        // PR 생성 시 headBranch(소스 브랜치, 이미 존재해야 함)와 baseBranch(대상 브랜치) 전달
        ...(isPR && {
          headBranch: data.headBranch?.trim() || undefined,
          baseBranch: data.baseBranch?.trim() || undefined,
        }),
      };

      await postTodoMutation.mutateAsync(body);
      closeModal();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        'no-scrollbar flex w-full flex-col bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]',
        'gap-3 rounded-t-[32px] p-6',
        'max-h-[90vh] overflow-y-auto',
        'md:w-[488px] md:gap-4 md:rounded-[40px] md:p-8',
      )}
    >
      <div className="mb-1 flex items-center justify-between md:mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-800">GitHub 할 일 생성</h1>
          {goalTitle && <p className="text-sm text-gray-500">{goalTitle}</p>}
        </div>
        <button
          type="button"
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          onClick={closeModal}
          disabled={isSubmitting}
        >
          <XIcon size={24} className="stroke-gray-400" />
        </button>
      </div>

      {submitError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500">{submitError}</p>}

      {/* 타입 선택 */}
      <FormField label="타입" required>
        <div className="flex gap-2">
          {SOURCE_OPTIONS.map((option) => {
            const isSelected = source === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('source', option.value, { shouldDirty: true })}
                className={clsx(
                  'flex flex-1 flex-col gap-1 rounded-2xl border p-3 text-left transition-all duration-150',
                  isSelected
                    ? 'border-bearlog-500 bg-bearlog-500/5'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300',
                )}
              >
                <span className={clsx('text-sm font-semibold', isSelected ? 'text-bearlog-600' : 'text-gray-700')}>
                  {option.label}
                </span>
                <span className="text-xs text-gray-500">{option.description}</span>
              </button>
            );
          })}
        </div>
      </FormField>

      {/* PR 생성 안내 */}
      {isPR && (
        <div className="rounded-2xl bg-[#F6F8FA] px-4 py-3 text-xs leading-5 text-gray-600">
          <p className="font-semibold text-gray-700">PR 생성 방식</p>
          <p>• PR을 생성할 소스 브랜치(Head)와 대상 브랜치(Base)를 직접 입력하세요.</p>
          <p>• 두 브랜치는 레포에 이미 존재해야 합니다.</p>
          <p>• 완료 처리 시 실제 PR이 merge됩니다.</p>
        </div>
      )}

      {/* Issue 생성 안내 */}
      {!isPR && (
        <div className="rounded-2xl bg-[#F6F8FA] px-4 py-3 text-xs leading-5 text-gray-600">
          <p className="font-semibold text-gray-700">Issue 생성 방식</p>
          <p>• 연결된 레포에 GitHub Issue가 생성됩니다.</p>
          <p>• 완료 처리 시 실제 Issue가 close됩니다.</p>
        </div>
      )}

      <FormField label="제목" required>
        <Input
          autoFocus
          {...register('title', { required: '제목은 필수입니다.' })}
          placeholder={isPR ? 'GitHub PR 제목을 입력해주세요' : 'GitHub Issue 제목을 입력해주세요'}
          className="h-11 rounded-xl border-gray-300 p-3 text-sm font-normal text-[#333] placeholder:text-gray-500 md:h-14 md:rounded-2xl md:p-4 md:text-base"
        />
        {errors.title && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.title.message}</p>}
      </FormField>

      {/* PR 전용 — Head 브랜치 입력 */}
      {isPR && (
        <FormField label="Head 브랜치 (소스)" required>
          <Input
            {...register('headBranch', { required: 'Head 브랜치는 PR 생성에 필수입니다.' })}
            placeholder="예: feature/my-feature"
            className="h-11 rounded-xl border-gray-300 p-3 text-sm font-normal text-[#333] placeholder:text-gray-500 md:h-14 md:rounded-2xl md:p-4 md:text-base"
          />
          {errors.headBranch && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.headBranch.message}</p>}
        </FormField>
      )}

      {/* PR 전용 — Base 브랜치 입력 */}
      {isPR && (
        <FormField label="Base 브랜치" required>
          <Input
            {...register('baseBranch', { required: 'Base 브랜치는 PR 생성에 필수입니다.' })}
            placeholder="예: main, develop"
            className="h-11 rounded-xl border-gray-300 p-3 text-sm font-normal text-[#333] placeholder:text-gray-500 md:h-14 md:rounded-2xl md:p-4 md:text-base"
          />
          {errors.baseBranch && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.baseBranch.message}</p>}
        </FormField>
      )}

      <FormField label="마감기한" required>
        <DateInput
          date={selectedDate}
          onSelect={(nextDate) => {
            setValue('dueDate', nextDate ? formatDateForAPI(nextDate) : undefined, {
              shouldValidate: true,
            });
          }}
          onConfirm={(nextDate) => {
            setValue('dueDate', nextDate ? formatDateForAPI(nextDate) : undefined, {
              shouldValidate: true,
            });
          }}
        />
        {errors.dueDate && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.dueDate.message}</p>}
      </FormField>

      <div className="mt-1 flex items-center gap-2 md:mt-[34px] md:gap-3">
        <Button
          type="button"
          variant="tertiary"
          className="h-12 w-full border border-gray-300 text-gray-500 md:h-14"
          onClick={closeModal}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button type="submit" variant="primary" className="h-12 w-full md:h-14" disabled={isSubmitting}>
          {isSubmitting ? '생성 중...' : isPR ? 'PR 생성' : 'Issue 생성'}
        </Button>
      </div>
    </form>
  );
}
