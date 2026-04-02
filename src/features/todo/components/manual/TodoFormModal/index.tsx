'use client';

import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { PatchTodoRequest, PostTodoRequest } from '@/lib/api';
import { usePatchTodo, usePostTodo } from '@/lib/mutations';
import { goalQueries, todoQueries } from '@/lib/queryKeys';
import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import FormField from '@/shared/components/FormField';
import Input from '@/shared/components/Input';
import { useModalStore } from '@/shared/stores/useModalStore';
import { formatDateForAPI } from '@/shared/utils/utils';

import DateInput from '../shared/DateInput';
import ImageInput from '../shared/ImageInput';
import LinkInput from '../shared/LinkInput';
import StatusField from '../shared/StatusField';
import { TagInput } from '../shared/TagInput';

interface BaseProps {
  goalDetailId?: number;
}

interface CreateMode extends BaseProps {
  mode: 'create';
  todo: PostTodoRequest;
}

interface EditMode extends BaseProps {
  mode: 'edit';
  todo: PatchTodoRequest & { id: number };
}

type TodoFormModalProps = CreateMode | EditMode;
type FormValues = PostTodoRequest & PatchTodoRequest;

export default function TodoFormModal({ mode, todo, goalDetailId }: TodoFormModalProps) {
  const { closeModal } = useModalStore();
  const isEditMode = mode === 'edit';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: isEditMode
      ? {
          title: todo.title ?? '',
          dueDate: todo.dueDate ?? undefined,
          linkUrl: todo.linkUrl ?? undefined,
          imageUrl: todo.imageUrl ?? undefined,
          tags: todo.tags ?? [],
          done: todo.done ?? false,
        }
      : {
          goalId: goalDetailId ?? todo.goalId ?? undefined,
          title: '',
          dueDate: undefined,
          linkUrl: undefined,
          imageUrl: undefined,
          tags: [],
          done: false,
        },
  });

  register('dueDate', { required: '마감기한은 필수입니다.' });

  const tags = useWatch({ control, name: 'tags' }) ?? [];
  const goalId = useWatch({ control, name: 'goalId' });
  const linkUrl = useWatch({ control, name: 'linkUrl' });
  const imageUrl = useWatch({ control, name: 'imageUrl' }) ?? null;
  const dueDate = useWatch({ control, name: 'dueDate' });
  const done = useWatch({ control, name: 'done' }) ?? false;

  const selectedDate = dueDate ? new Date(dueDate) : undefined;

  const { data: goals } = useQuery(goalQueries.list());

  const todoId = isEditMode && 'id' in todo ? todo.id : 0;
  const { data: todoDetail } = useQuery({
    ...todoQueries.detail(todoId),
    enabled: isEditMode && !!todoId,
  });

  const postTodoMutation = usePostTodo();
  const patchTodoMutation = usePatchTodo(todoId);

  useEffect(() => {
    if (!isEditMode || !todoDetail) return;

    reset({
      title: todoDetail.title ?? '',
      goalId: todoDetail.goal?.id,
      dueDate: todoDetail.dueDate ?? undefined,
      linkUrl: todoDetail.linkUrl ?? undefined,
      imageUrl: todoDetail.imageUrl ?? undefined,
      tags: todoDetail.tags ? todoDetail.tags.map((tag) => tag.name) : [],
      done: todoDetail.done ?? false,
    });
  }, [isEditMode, reset, todoDetail]);

  useEffect(() => {
    if (isEditMode) return;
    if (goalId || !goals?.goals?.length) return;

    const nextGoalId = goalDetailId ?? goals.goals[0]?.id;
    if (nextGoalId === undefined) return;

    setValue('goalId', nextGoalId, { shouldDirty: false });
  }, [goalDetailId, goalId, goals, isEditMode, setValue]);

  const goalOptions =
    goals?.goals?.map((goal) => ({
      label: goal.title ?? '',
      value: String(goal.id),
    })) ?? [];

  const defaultGoalId = isEditMode
    ? todoDetail?.goal?.id
      ? String(todoDetail.goal.id)
      : goalOptions[0]?.value
    : todo.goalId
      ? String(todo.goalId)
      : goalOptions[0]?.value;

  const onSubmit = async (data: FormValues) => {
    if (isEditMode && 'id' in todo) {
      await patchTodoMutation.mutateAsync({
        title: data.title,
        dueDate: data.dueDate,
        linkUrl: data.linkUrl,
        imageUrl: data.imageUrl,
        tags: data.tags,
        done: data.done,
      });
    } else {
      await postTodoMutation.mutateAsync({
        source: 'MANUAL',
        title: data.title,
        goalId: data.goalId,
        dueDate: data.dueDate,
        linkUrl: data.linkUrl,
        imageUrl: data.imageUrl,
        tags: data.tags,
      });
    }

    closeModal();
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
        <h1 className="text-xl font-semibold text-gray-800">{isEditMode ? '할 일 수정' : '할 일 생성'}</h1>
        <button type="button" className="cursor-pointer" onClick={closeModal}>
          <XIcon size={24} className="stroke-[#A4A4A4]" />
        </button>
      </div>

      {isEditMode && (
        <StatusField
          done={done}
          onChange={(nextDone) => {
            setValue('done', nextDone, { shouldDirty: true });
          }}
        />
      )}

      <FormField label="제목" required>
        <Input
          autoFocus
          {...register('title', { required: '제목은 필수입니다.' })}
          placeholder="할 일의 제목을 적어주세요"
          className="h-11 rounded-xl border-gray-300 p-3 text-sm font-normal text-[#333] placeholder:text-gray-500 md:h-14 md:rounded-2xl md:p-4 md:text-base"
        />
        {errors.title && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.title.message}</p>}
      </FormField>

      <FormField label="목표" required>
        <Dropdown
          defaultValue={defaultGoalId}
          {...register('goalId', { required: '목표는 필수입니다.' })}
          items={goalOptions}
          selectedValue={goalId ? String(goalId) : ''}
          onSelectItem={(item) => setValue('goalId', Number(item.value), { shouldDirty: true })}
          isDisabled={isEditMode}
          className="h-11 rounded-xl p-3 placeholder:text-gray-500 md:h-14 md:rounded-2xl md:p-4"
        />
        {errors.goalId && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.goalId.message}</p>}
      </FormField>

      <FormField label="마감기한" required>
        <DateInput
          date={selectedDate}
          onSelect={(nextDate) => {
            setValue('dueDate', nextDate ? formatDateForAPI(nextDate) : undefined, { shouldValidate: true });
          }}
          onConfirm={(nextDate) => {
            setValue('dueDate', nextDate ? formatDateForAPI(nextDate) : undefined, { shouldValidate: true });
          }}
        />
        {errors.dueDate && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.dueDate.message}</p>}
      </FormField>

      <FormField label="태그">
        <TagInput
          tags={tags}
          onAddTag={(tag) => setValue('tags', [...tags, tag], { shouldDirty: true })}
          onRemoveTag={(tag) =>
            setValue(
              'tags',
              tags.filter((currentTag) => currentTag !== tag),
              { shouldDirty: true },
            )
          }
        />
      </FormField>

      <FormField label="링크">
        <LinkInput
          value={linkUrl ?? ''}
          onChange={(value) => setValue('linkUrl', value || undefined, { shouldDirty: true })}
        />
      </FormField>

      <FormField label="이미지">
        <ImageInput
          image={imageUrl}
          onChange={(nextImage) => {
            setValue('imageUrl', nextImage ?? undefined, { shouldDirty: true });
          }}
        />
      </FormField>

      <div className="mt-1 flex items-center gap-2 md:mt-[34px] md:gap-3">
        <Button
          type="button"
          variant="tertiary"
          className="h-12 w-full border border-gray-300 text-gray-500 md:h-14"
          onClick={closeModal}
        >
          취소
        </Button>
        <Button type="submit" variant="primary" className="h-12 w-full md:h-14">
          확인
        </Button>
      </div>
    </form>
  );
}
