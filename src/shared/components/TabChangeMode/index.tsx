'use client';

import clsx from 'clsx';
import { memo, useCallback, useState } from 'react';

type TabMode = 'MANUAL' | 'GITHUB';
interface TabChangeModeProps {
  mode: TabMode;
  onModeChange?: (mode: TabMode) => void;
}
function TabChangeMode({ mode, onModeChange }: TabChangeModeProps) {
  const MODE_OPTIONS: { label: string; value: TabMode }[] = [
    { label: '일반 모드', value: 'MANUAL' },
    { label: '개발자 모드', value: 'GITHUB' },
  ];
  const [selectedMode, setSelectedMode] = useState<TabMode>(mode);

  const handleSelectMode = useCallback(
    (mode: TabMode) => {
      setSelectedMode(mode);
      if (onModeChange) {
        onModeChange(mode);
      }
    },
    [onModeChange],
  );
  return (
    <div
      role="tablist"
      aria-label="모드 선택"
      className="inline-flex h-fit items-center rounded-full bg-[#D9D9D9] px-2 py-[7px]"
    >
      {MODE_OPTIONS.map((option) => {
        const isActive = selectedMode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelectMode(option.value)}
            className={clsx(
              'rounded-full px-[14.5px] py-[3px] text-lg text-[20px] leading-7 font-medium transition-all duration-200',
              isActive
                ? 'bg-bearlog-500 text-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                : 'bg-transparent text-[#8A8A8A] hover:bg-white/40',
              option.value === 'GITHUB' && 'px-5 text-[18px]',
            )}
          >
            {option.value === 'MANUAL' ? (
              '일반 모드'
            ) : (
              <div className="flex items-center gap-2">
                개발자 모드
                {isActive && <ModeGithub />}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
export default memo(TabChangeMode);

function ModeGithub() {
  return (
    <div className="flex h-[19px] items-center rounded-lg bg-[rgba(103,255,200,0.3)] px-[8px] py-[4px] text-[10px] font-medium text-gray-100">
      Github
    </div>
  );
}
