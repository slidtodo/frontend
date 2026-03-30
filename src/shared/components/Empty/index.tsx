import Image from 'next/image';
import emptyIcon from '@/features/note/assets/icons/icon-empty.png';

export default function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-[504px] flex-col items-center justify-center gap-[10px] text-sm font-medium text-slate-500 md:gap-[18px] md:text-base">
      <Image
        src={emptyIcon}
        alt="데이터 없이 빈 화면일 때, 서비스 시그니처 캐릭터"
        className="h-[85px] w-[79px] md:h-[140px] md:w-[130px]"
      />
      {children}
    </div>
  );
}
