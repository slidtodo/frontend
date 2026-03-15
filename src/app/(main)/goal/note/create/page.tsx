import PageHeader from '@/shared/components/PageHeader';

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="shirnk-0 flex items-center justify-between">
        <PageHeader title={'노트 작성하기'} />
        <div className="flex gap-2">
          <button>임시저장</button>
          <button>등록하기</button>
        </div>
      </section>
      <section className="flex-1">
        <div>노트 에디터 위치</div>
      </section>
    </div>
  );
}
