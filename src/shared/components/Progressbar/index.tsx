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
    <div className="w-full flex gap-[8px] md:gap-[10px] items-center transition-all duration-300">
      <div className="w-full h-2 bg-[#E9E9E9] rounded">
        <div className="h-full bg-[#FF8442] rounded" style={{ width: `${progress}%` }}></div>
      </div>
      {number && (
        <span className="text-sm md:text-base  md:font-bold text-[#EF6C00] mt-1 transition-all duration-300">
          {progress}%
        </span>
      )}
    </div>
  );
}
