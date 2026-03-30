'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ImageUpIcon, XIcon } from 'lucide-react';

interface ImageInput {
  image: string | null;
  onChange: (image: string | null) => void;
}

export default function ImageInput({ image, onChange }: ImageInput) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      onChange(URL.createObjectURL(file));

      e.target.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);
  return (
    <>
      {image ? (
        <div className="relative h-[101px] w-[160px] overflow-hidden rounded-2xl">
          {/* 이미지 */}
          <Image src={image} alt="이미지 미리보기" fill className="object-cover" />
          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={() => {
              onChange(null);
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
      <p className="px-1 text-xs font-medium text-[#A4A4A4] md:text-sm">이미지는 최대 1개만 첨부할 수 있습니다.</p>
    </>
  );
}
