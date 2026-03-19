import PageHeader from '@/shared/components/PageHeader';
import NoteEditor from '@/features/goal/note/components/NoteEditor';
import Button from '@/shared/components/Button';

export default function Page() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[768px] flex-col">
      <section className="mb-0 flex shrink-0 items-center justify-between md:mt-4 md:mb-3 md:gap-4 lg:mt-10 lg:mb-[22px]">
        <PageHeader title={'노트 작성하기'} />
        <div className="flex gap-2">
          <Button variant="secondary" className="cursor-pointer text-sm md:h-10 md:px-[27px]">
            임시저장
          </Button>
          <Button variant="primary" className="cursor-pointer text-sm md:h-10 md:px-[27px]">
            등록하기
          </Button>
        </div>
      </section>
      <section className="flex-1 md:mb-[30px] lg:mb-[62px]">
        <NoteEditor />
      </section>
    </div>
  );
}
