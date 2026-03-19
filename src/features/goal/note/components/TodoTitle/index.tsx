import Tag from "@/shared/components/Tag";

export async function TodoTitle({ todoId }: { todoId: number }) {
  /**
   * @TODO 실제 API URL로 대체
   * const res = await fetch(`{BASE_URL}/todos/${todoId}`);
   */
  // const res = await fetch(`{BASE_URL}/todos/${todoId}`);
  // const data = await res.json();

  // return <div>{data.title}</div>;
  return (
    <div className="flex gap-2">
      <Tag string="TODO" variant="orange" className="semibold rounded-lg px-[5.5px] py-[3px] text-xs" />
      <p className="text-sm font-normal text-[#333]">{todoId} 할 일 제목</p>
    </div>
  );
}
