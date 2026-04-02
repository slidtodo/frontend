'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ImageUpIcon, LoaderIcon, XIcon } from 'lucide-react';

import { fetchImages } from '@/lib/api';

interface ImageInput {
  image: string | null;
  onChange: (image: string | null) => void;
}

export default function ImageInput({ image, onChange }: ImageInput) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setIsUploading(true);
    try {
      const { uploadUrl, url } = await fetchImages.getPresignedUrl(file.name);
      await fetch(uploadUrl, { method: 'PUT', body: file });
      onChange(url);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {image ? (
        <div className="relative h-[101px] w-[160px] overflow-hidden rounded-2xl">
          <Image src={image} alt="이미지 미리보기" fill unoptimized className="object-cover" />
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
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-[101px] w-full cursor-pointer flex-col items-center justify-center gap-[2px] rounded-2xl border border-dashed border-[#CCC] bg-[#FAFAFA] disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <LoaderIcon size={24} className="animate-spin stroke-[#A4A4A4]" />
          ) : (
            <>
              <ImageUpIcon size={24} className="stroke-[#A4A4A4]" />
              <p className="text-base font-medium text-[#A4A4A4]">이미지 첨부</p>
            </>
          )}
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />
      <p className="px-1 text-xs font-medium text-[#A4A4A4] md:text-sm">이미지는 최대 1개만 첨부할 수 있습니다.</p>
    </>
  );
}
