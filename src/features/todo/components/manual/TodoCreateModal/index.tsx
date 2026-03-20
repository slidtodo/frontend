'use client';

import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import FormField from '@/shared/components/FormField';
import Input from '@/shared/components/Input';
import { useModalStore } from '@/shared/stores/useModalStore';
import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { ImageType } from '@/features/todo/components/types/types';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { TagInput } from './TagInput';
import LinkInput from './LinkInput';
import ImageInput from './ImageInput';
import DateInput from './DateInput';
import { formatDate, formatDateForAPI } from '@/shared/utils/utils';

interface TodoCreateForm {
  title: string;
  goalId: number;
  dueDate: string | null;
  linkUrl: string | null;
  imageUrl: string | null;
  tags: string[];
}

export default function TodoCreateModal() {
  const { closeModal } = useModalStore();

  // react-hook-form으로 관리 안 되는 것들만 별도 state
  const [image, setImage] = useState<ImageType | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [tempDate, setTempDate] = useState<Date | undefined>();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TodoCreateForm>({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      goalId: 1,
      dueDate: null,
      linkUrl: null,
      imageUrl: null,
      tags: [],
    },
  });

  const tags = useWatch({ control, name: 'tags' }) ?? [];
  const goalId = useWatch({ control, name: 'goalId' });
  const linkUrl = useWatch({ control, name: 'linkUrl' });

  const onSubmit = (data: TodoCreateForm) => {
    const body = {
      source: 'manual',
      ...data,
    };
    /** @TODO 추후 API 연결로 대체 */
    console.log(body);
    closeModal();
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
      {/* 할 일 생성 헤더 */}
      <div className="mb-1 flex items-center justify-between md:mb-4">
        <h1 className="text-xl font-semibold text-[#262626]">할 일 생성</h1>
        <button type="button" className="cursor-pointer" onClick={closeModal}>
          <XIcon size={24} className="stroke-[#A4A4A4]" />
        </button>
      </div>

      {/* 제목 */}
      <FormField label="제목" required>
        <Input
          {...register('title', { required: '제목은 필수입니다.' })}
          placeholder="할 일의 제목을 적어주세요"
          className="h-11 rounded-xl border-[#CCC] p-3 text-sm font-normal text-[#333] placeholder:text-[#737373] md:h-14 md:rounded-2xl md:p-4 md:text-base"
        />
        {errors.title && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.title.message}</p>}
      </FormField>

      {/* 목표 */}
      <FormField label="목표" required>
        <Dropdown
          {...register('goalId', { required: '목표는 필수입니다.' })}
          items={[
            { label: '자바스크립트로 웹 서비스 만들기', value: '1' },
            { label: '디자인 시스템 정복하기', value: '2' },
          ]}
          selectedValue={String(goalId)}
          onSelectItem={(item) => setValue('goalId', Number(item.value))}
          className="h-11 rounded-xl p-3 placeholder:text-[#737373] md:h-14 md:rounded-2xl md:p-4"
        />
        {errors.goalId && <p className="px-1 text-xs text-red-500 md:text-sm">{errors.goalId.message}</p>}
      </FormField>

      {/* 마감기한 */}
      <FormField label="마감기한" required>
        <DateInput
          date={tempDate}
          onSelect={setTempDate}
          onConfirm={(d) => {
            setDate(d);
            setValue('dueDate', d ? formatDateForAPI(d) : null, { shouldValidate: true });
          }}
          onCancel={() => setTempDate(date)}
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
        <LinkInput value={linkUrl ?? ''} onChange={(val) => setValue('linkUrl', val || null)} />
      </FormField>

      {/* 이미지 */}
      <FormField label="이미지">
        <ImageInput
          image={image}
          onChange={(img) => {
            setImage(img);
            setValue('imageUrl', img?.previewUrl ?? null);
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
