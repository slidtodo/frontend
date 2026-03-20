'use client';

import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import FormField from '@/shared/components/FormField';
import Input from '@/shared/components/Input';
import { useModalStore } from '@/shared/stores/useModalStore';
import clsx from 'clsx';
import { ImageUpIcon, Link2, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

type Image = {
  file: File;
  previewUrl: string;
};

export default function TodoCreateModal() {
  const { closeModal } = useModalStore();
  const urlInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedGoal, setSelectedGoal] = useState('1');
  const [urlInput, setUrlInput] = useState('');
  const [image, setImage] = useState<Image | null>(null);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      setImage({
        file,
        previewUrl: URL.createObjectURL(file),
      });

      e.target.value = '';
    }
  };

  return (
    <form
      className={clsx(
        'flex w-full flex-col bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]',
        'gap-3 rounded-t-[32px] p-6',
        'md:w-[488px] md:gap-4 md:rounded-[40px] md:p-8',
        'no-scrollbar max-h-[90vh] overflow-y-auto',
      )}
    >
      {/** 할 일 생성 */}
      <div className="mb-1 flex items-center justify-between md:mb-4">
        <h1 className="text-xl font-semibold text-[#262626]">할 일 생성</h1>
        <button type="button" className="cursor-pointer" onClick={() => closeModal()}>
          <XIcon size={24} className="stroke-[#A4A4A4]" />
        </button>
      </div>

      {/** 폼 부분 */}
      <FormField label="제목" required>
        <Input
          placeholder="할 일의 제목을 적어주세요"
          className="h-11 rounded-xl border-[#CCC] p-3 text-sm font-normal text-[#333] placeholder:text-[#737373] md:h-14 md:rounded-2xl md:p-4 md:text-base"
        />
      </FormField>

      <FormField label="목표" required>
        <Dropdown
          items={[
            { label: '자바스크립트로 웹 서비스 만들기', value: '1' },
            { label: '디자인 시스템 정복하기', value: '2' },
          ]}
          selectedValue={selectedGoal ? selectedGoal : '1'}
          onSelectItem={(item) => setSelectedGoal(item.value)}
          className="h-11 rounded-xl p-3 text-sm font-normal text-[#333] placeholder:text-[#737373] md:h-14 md:rounded-2xl md:p-4 md:text-base"
        />
      </FormField>

      <FormField label="마감기한" required>
        <Input
          placeholder="날짜를 선택해주세요"
          className="h-11 rounded-xl border-[#CCC] p-3 text-sm font-normal text-[#333] placeholder:text-[#737373] md:h-14 md:rounded-2xl md:p-4 md:text-base"
        />
      </FormField>

      <FormField label="태그">
        <Input
          placeholder="입력 후 Enter"
          className="h-11 rounded-xl border-[#CCC] p-3 text-sm font-normal text-[#333] placeholder:text-[#737373] md:h-14 md:rounded-2xl md:p-4 md:text-base"
        />
      </FormField>

      <FormField label="링크">
        <div className="flex h-14 w-full items-center justify-between rounded-2xl border border-dashed border-[#CCC] bg-[#FAFAFA] px-4 py-3">
          <div className="flex items-center gap-2">
            <Link2 size={20} className="shrink-0 -rotate-45 stroke-[#737373] md:h-6 md:w-6" />
            <input
              ref={urlInputRef}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="링크를 업로드해주세요"
              className="w-full flex-1 border-none bg-transparent p-0 text-base text-[#333] placeholder:text-[#737373] focus:outline-none"
            />
          </div>
          {/* 링크 입력 후 삭제 버튼 */}
          {urlInput && (
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                setUrlInput('');
                urlInputRef.current?.focus();
              }}
            >
              <XIcon size={20} className="shrink-0 stroke-[#737373] md:h-6 md:w-6" />
            </button>
          )}
        </div>
      </FormField>

      <FormField label="이미지">
        {image ? (
          <div className="relative h-[101px] w-[160px] overflow-hidden rounded-2xl">
            {/* 이미지 */}
            <Image src={image.previewUrl} alt="이미지 미리보기" fill className="object-cover" />
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => {
                setImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-[10px] right-[10px] flex size-[18px] cursor-pointer items-center justify-center rounded-full border border-[#CCC] bg-white"
            >
              <XIcon size={10} className="stroke-[#A4A4A4]" />
            </button>
          </div>
        ) : (
          /* 이미지 없을 때 업로드 버튼 */
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-[101px] w-full cursor-pointer flex-col items-center justify-center gap-[2px] rounded-2xl border border-dashed border-[#CCC] bg-[#FAFAFA]"
          >
            <ImageUpIcon size={24} className="stroke-[#A4A4A4]" />
            <p className="text-base font-medium text-[#A4A4A4]">이미지 첨부</p>
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />
        <p className="px-1 text-sm font-medium text-[#A4A4A4]">이미지는 최대 1개만 첨부할 수 있습니다.</p>
      </FormField>

      <div className="mt-1 flex items-center gap-2 md:mt-[34px] md:gap-3">
        <Button type="button" variant="secondary" className="h-12 w-full md:h-14" onClick={() => closeModal()}>
          취소
        </Button>
        <Button type="submit" variant="confirm" className="h-12 w-full md:h-14">
          확인
        </Button>
      </div>
    </form>
  );
}
