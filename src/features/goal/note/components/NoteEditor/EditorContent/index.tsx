import clsx from 'clsx';

type EditorContentProps = {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

export default function EditorContent({ content, onChange, className }: EditorContentProps) {
  const withSpace = content.length;
  const withoutSpace = content.replace(/\s/g, '').length;

  return (
    <section className={clsx('flex min-h-144 flex-1 flex-col gap-2 pt-[14px] lg:pt-[10px]', className)}>
      <textarea
        value={content}
        onChange={onChange}
        placeholder="이 곳을 통해 노트 작성을 시작해주세요"
        className="w-full flex-1 resize-none bg-transparent text-sm font-normal text-[#333333] outline-none placeholder:text-[#A4A4A4] md:text-base"
      />
      <p className="text-right text-xs font-normal text-[#A4A4A4]">
        공백포함 {withSpace}자 | 공백제외 {withoutSpace}자
      </p>
    </section>
  );
}
