'use client';

import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import FormField from '@/shared/components/FormField';
import Input from '@/shared/components/Input';
import { useModalStore } from '@/shared/stores/useModalStore';
import { ImageUpIcon, Link2, XIcon } from 'lucide-react';

export default function TodoCreateModal() {
  const { closeModal } = useModalStore();

  return (
    <div className="flex max-w-[488px] min-w-[375px] flex-col rounded-4xl bg-white p-6 shadow-xl md:rounded-[40px] md:p-8">
      {/** 할 일 생성 */}
      <div className="mb-4 flex items-center justify-between md:mb-8">
        <h1 className="text-xl font-semibold text-[#262626]">할 일 생성</h1>
        <button type="button" className="cursor-pointer" onClick={() => closeModal()}>
          <XIcon size={24} className="stroke-[#A4A4A4]" />
        </button>
      </div>

      {/** 폼 부분 */}
      <form className="flex flex-col gap-3 md:gap-4">
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
              { label: '자바스크립트로 웹 서비스 만들기', value: '' },
            ]}
            selectedValue="자바스크립트로 웹 서비스 만들기"
            onSelectItem={() => console.log('자바스크립트')}
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
                placeholder="링크를 업로드해주세요"
                className="w-full flex-1 border-none bg-transparent p-0 text-base text-[#333] placeholder:text-[#737373] focus:outline-none"
              />
            </div>
            {/* 링크 입력 후 삭제 버튼 */}
            <button type="button" className="cursor-pointer" onClick={() => {}}>
              <XIcon size={20} className="shrink-0 stroke-[#737373] md:h-6 md:w-6" />
            </button>
          </div>
        </FormField>

        <FormField label="이미지">
          <label className="flex h-[101px] w-full cursor-pointer flex-col items-center justify-center gap-[2px] rounded-2xl border border-dashed border-[#CCC] bg-[#FAFAFA]">
            <input type="file" hidden />
            <ImageUpIcon size={24} className="stroke-[#A4A4A4]" />
            <p className="text-base font-medium text-[#A4A4A4]">이미지 첨부</p>
          </label>
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
    </div>
  );
}
