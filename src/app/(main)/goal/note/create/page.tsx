import PageHeader from '@/shared/components/PageHeader';
import NoteEditor from '../../../../../features/goal/note/components/NoteEditor';
import Button from '@/shared/components/Button';

export default function Page() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[768px] flex-col p-4">
      <section className="md:felx mb-3 flex hidden shrink-0 items-center justify-between md:mt-[48px] lg:mt-[72px] lg:mb-[22px]">
        <PageHeader title={'노트 작성하기'} />
        <div className="flex gap-2">
          <Button variant="secondary" className="cursor-pointer md:px-[27px] md:py-[10px]">
            임시저장
          </Button>
          <Button variant="primary" className="cursor-pointer md:px-[27px] md:py-[10px]">
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
