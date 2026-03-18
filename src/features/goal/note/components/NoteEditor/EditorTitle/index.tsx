import Image from 'next/image';
import noteIcon from '@/features/goal/note/assets/icons/icon-note.png';
import Input from '@/shared/components/Input';
import clsx from 'clsx';

type EditorTitleProps = {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function EditorTitle({ title, onChange }: EditorTitleProps) {
  return (
    <section className="flex w-full items-center justify-between gap-3 pb-[30px]">
      <Image src={noteIcon} width={40} height={40} alt="노트 아이콘" className="shrink-0" />

      <Input
        value={title}
        onChange={onChange}
        maxLength={30}
        placeholder="노트의 제목을 입력해주세요"
        className={clsx(
          'min-w-0 flex-1 border-none p-0 text-left text-slate-700 outline-none',
          'text-base font-semibold',
          'md:text-2xl md:font-semibold',
        )}
      />

      <p className="shrink-0 text-right text-xs font-medium text-slate-500">
        {title.length}/<span className="text-[#EF6C00]">30</span>
      </p>
    </section>
  );
}
