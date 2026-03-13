interface GoalBoxProps {
  data: {
    id: number;
    title: string;
    description: string;
    progress: number;
    todoList: { id: number; title: string; isCompleted: boolean; star: boolean }[];
    doneList: { id: number; title: string; star: boolean }[];
  };
}

export default function GoalBox({ data }: GoalBoxProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[40px] bg-white px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div>{data.title}</div>
          <div>{data.progress}</div>
        </div>
        <div className="flex gap-[14px]">
          <div>검색인풋</div>
          <div>할일 추가 버튼</div>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="rounded-[24px] bg-[#FFF8E4] p-6"></div>
        <div className="rounded-[24px] bg-[#ffffff] p-6"></div>
      </div>
    </article>
  );
}
