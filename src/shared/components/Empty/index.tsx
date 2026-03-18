import Image from 'next/image';
import emptyIcon from '@/features/goal/note/assets/icons/icon-empty.png';

export default function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[504px] flex h-full flex-col items-center justify-center gap-[10px] md:gap-[18px]">
      <Image
        src={emptyIcon}
        alt="데이터 없이 빈 화면일 때, 서비스 시그니처 캐릭터"
        className="h-[84.5px] w-[79.18px] md:h-[140px] md:w-[130.41px]"
      />
      <p className="text-sm font-medium text-slate-500 md:text-base">{children}</p>
    </div>
  );
}
