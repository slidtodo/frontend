'use client';
import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import FormField from '@/shared/components/FormField';
import Input from '@/shared/components/Input';
import { TagInput } from '../shared/TagInput';
import LinkInput from '../shared/LinkInput';
import ImageInput from '../shared/ImageInput';
import DateInput from '../shared/DateInput';

import { fetchTodos } from '@/lib/api';
import { formatDateForAPI } from '@/shared/utils/utils';
import { useModalStore } from '@/shared/stores/useModalStore';
import { goalQueries } from '@/lib/queryKeys';
import { PostTodoRequest, PatchTodoRequest } from '@/lib/api';

interface BaseProps {
  goalDetailId?: number;
}
interface CreateMode extends BaseProps {
  mode: 'create';
  todo?: PostTodoRequest;
}

interface EditMode extends BaseProps {
  mode: 'edit';
  todo: PatchTodoRequest & { id: number };
}

type TodoFormModalProps = CreateMode | EditMode;

type FormValues = PostTodoRequest;

export default function TodoFormModal({ mode, todo, goalDetailId }: TodoFormModalProps) {
  const { closeModal } = useModalStore();
  const isEditMode = mode === 'edit';
  const [image, setImage] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();

  const {
    register,
    handleSubmit,
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
        }
      : {
          goalId: goalDetailId ?? todo?.goalId ?? undefined,
          title: '',
          dueDate: undefined,
          linkUrl: undefined,
          imageUrl: undefined,
          tags: [],
        },
  });

  register('dueDate', { required: '마감기한은 필수입니다.' });
  const tags = useWatch({ control, name: 'tags' }) ?? [];
  const goalId = useWatch({ control, name: 'goalId' });
  const linkUrl = useWatch({ control, name: 'linkUrl' });

  // TODO: mutain처리
  const onSubmit = async (data: FormValues) => {
    if (isEditMode) {
      await fetchTodos.patchTodo(todo.id, {
        title: data.title,
        dueDate: data.dueDate,
        linkUrl: data.linkUrl,
        imageUrl: data.imageUrl,
        tags: data.tags,
        done: todo.done,
      });
    } else {
      const body: PostTodoRequest = {
        source: 'MANUAL',
        title: data.title,
        goalId: data.goalId,
        dueDate: data.dueDate,
        linkUrl: data.linkUrl,
        imageUrl: data.imageUrl,
        tags: data.tags,
      };
      await fetchTodos.postTodo(body);
    }
    closeModal();
  };

  const { data: goals } = useQuery(goalQueries.list());

  const goalOptions = () => {
    if (!goals) return [];
    return (goals?.goals ?? []).map((goal) => ({
      label: goal.title ?? '',
      value: String(goal.id),
    }));
  };
  // TODO: 수정모드에서 골id가 없음... 아님 수정하지 말아야 하는지 흠...
  const defaultGoalId = () => {
    if (isEditMode) {
      // return String(todo.id);
    } else {
      return todo?.goalId ? String(todo.goalId) : goalOptions()[0]?.value;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        'no-scrollbar flex w-full flex-col bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]',
        'gap-3 rounded-t-[32px] p-6',
        'md:w-[488px] md:gap-4 md:rounded-[40px] md:p-8',
        'max-h-[90vh] overflow-y-auto',
      )}
    >
      {/* 헤더 */}
      <div className="mb-1 flex items-center justify-between md:mb-4">
        <h1 className="text-xl font-semibold text-[#262626]">{isEditMode ? '할 일 수정' : '할 일 생성'}</h1>
        <button type="button" className="cursor-pointer" onClick={closeModal}>
          <XIcon size={24} className="stroke-[#A4A4A4]" />
        </button>
      </div>

      {/* 상태 필드: edit 모드에서만 노출 */}
      {/* {isEditMode && (
        <StatusField
          done={todo.done ?? false}
          onChange={(val) => setValue('done', val, { shouldValidate: true })}
          errorMessage={errors.done?.message}
        />
      )} */}

      {/* 제목 */}
      <FormField label="제목" required>
        <Input
          autoFocus
          {...register('title', { required: '제목은 필수입니다.' })}
          placeholder="할 일의 제목을 적어주세요"
          className="h-11 rounded-xl border-[#CCC] p-3 text-sm font-normal text-[#333] placeholder:text-[#737373] md:h-14 md:rounded-2xl md:p-4 md:text-base"
        />
        {errors.title && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.title.message}</p>}
      </FormField>

      {/* 목표 */}
      <FormField label="목표" required>
        <Dropdown
          defaultValue={defaultGoalId()}
          {...register('goalId', { required: '목표는 필수입니다.' })}
          items={goalOptions()}
          selectedValue={String(goalId)}
          onSelectItem={(item) => setValue('goalId', Number(item.value))}
          className="h-11 rounded-xl p-3 placeholder:text-[#737373] md:h-14 md:rounded-2xl md:p-4"
        />
        {errors.goalId && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.goalId.message}</p>}
      </FormField>

      {/* 마감기한 */}
      <FormField label="마감기한" required>
        <DateInput
          date={date}
          onSelect={(date) => {
            setDate(date);
            setValue('dueDate', date ? formatDateForAPI(date) : undefined, { shouldValidate: true });
          }}
          onConfirm={(d) => {
            setDate(d);
            setValue('dueDate', date ? formatDateForAPI(date) : undefined, { shouldValidate: true });
          }}
        />
        {errors.dueDate && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.dueDate.message}</p>}
      </FormField>

      {/* 태그 */}
      <FormField label="태그">
        <TagInput
          tags={tags}
          onAddTag={(tag) => setValue('tags', [...tags, tag])}
          onRemoveTag={(tag) =>
            setValue(
              'tags',
              tags.filter((t) => t !== tag),
            )
          }
        />
      </FormField>

      {/* 링크 */}
      <FormField label="링크">
        <LinkInput value={linkUrl ?? ''} onChange={(val) => setValue('linkUrl', val || undefined)} />
      </FormField>

      {/* 이미지 */}
      <FormField label="이미지">
        <ImageInput
          image={image}
          onChange={(img) => {
            setImage(img);
            setValue('imageUrl', img ?? undefined);
          }}
        />
      </FormField>

      {/* 버튼 */}
      <div className="mt-1 flex items-center gap-2 md:mt-[34px] md:gap-3">
        <Button
          type="button"
          variant="secondary"
          className="h-12 w-full border border-[#CCC] text-[#737373] md:h-14"
          onClick={closeModal}
        >
          취소
        </Button>
        <Button type="submit" variant="confirm" className="h-12 w-full md:h-14">
          확인
        </Button>
      </div>
    </form>
  );
}
