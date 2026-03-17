interface ProgressbarProps {
  /**
   * @description
   * progress: 현재 진행 상황을 나타내는 바 (숫자)
   */
  progress: number;
  /**
   * @description
   * number: 진행 상황을 숫자로 표시할지 여부 (기본값: true)
   */
  number?: boolean;
}
export default function Progressbar({ progress, number = true }: ProgressbarProps) {
  return (
    <div className="flex w-full items-center gap-[8px] transition-all duration-300 md:gap-[10px]">
      <div className="h-2 w-full rounded bg-[#E9E9E9]">
        <div className="h-full rounded bg-[#FF8442]" style={{ width: `${progress}%` }}></div>
      </div>
      {number && (
        <span className="text-sm text-[#EF6C00] transition-all duration-300 md:text-base md:font-bold">
          {progress}%
        </span>
      )}
    </div>
  );
}
