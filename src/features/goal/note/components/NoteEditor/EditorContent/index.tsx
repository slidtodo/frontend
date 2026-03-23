import clsx from 'clsx';

type EditorContentProps = {
  content: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  readOnly?: boolean;
};

export default function EditorContent({ content, onChange, className, readOnly = false }: EditorContentProps) {
  const withSpace = content.length;
  const withoutSpace = content.replace(/\s/g, '').length;

  return (
    <section className={clsx('flex min-h-144 flex-1 flex-col gap-2 pt-[14px] lg:pt-[10px]', className)}>
      <textarea
        value={content}
        onChange={onChange}
        readOnly={readOnly}
        placeholder="이 곳을 통해 노트 작성을 시작해주세요"
        className={clsx(
          'w-full flex-1 resize-none bg-transparent text-sm font-normal text-[#333333] outline-none placeholder:text-[#A4A4A4] md:text-base',
          readOnly && 'cursor-default',
        )}
      />
      {/* readOnly일 때 글자수 카운터 숨김 */}
      {!readOnly && (
        <p className="text-right text-xs font-normal text-[#A4A4A4]">
          공백포함 {withSpace}자 | 공백제외 {withoutSpace}자
        </p>
      )}
    </section>
  );
}
