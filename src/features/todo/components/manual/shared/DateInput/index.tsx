'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import clsx from 'clsx';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ko } from 'date-fns/locale';
import { formatDate } from '@/shared/utils/utils';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import Button from '@/shared/components/Button';
import { cn } from '@/lib/utils';

interface DateInputProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onConfirm: (date: Date | undefined) => void;
  onCancel: () => void;
}

export default function DateInput({ date, onSelect, onConfirm, onCancel }: DateInputProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
        setOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={clsx(
            'flex w-full cursor-pointer items-center gap-2 rounded-xl border border-[#CCC] p-3',
            'text-sm font-normal',
            'md:h-14 md:rounded-2xl md:p-4 md:text-base',
            open && 'border border-[#FF8442]',
          )}
          data-empty={!date}
        >
          <CalendarIcon size={20} className="shrink-0 stroke-[#737373] md:size-6" />
          {date ? (
            <span className="text-[#333]">{formatDate(date)}</span>
          ) : (
            <span className="text-[#737373]">날짜를 선택해주세요</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[328px] w-auto bg-white p-0" sideOffset={10} side="bottom" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          locale={ko}
          showOutsideDays
          className="w-[328px] p-0 [--cell-radius:9999px] [--cell-size:40px]"
          classNames={{
            root: 'w-[328px]',
            months: 'flex flex-col w-full px-6',
            month: 'flex w-full flex-col',
            month_caption: 'flex w-full items-center justify-center pt-5',

            // 요일
            weekdays: 'flex w-full mt-3',
            weekday: 'w-10 h-10 flex items-center justify-center text-sm font-medium text-[#333] tracking-[-0.42px]',

            // 날짜 행
            weeks: 'pb-4',
            week: 'flex w-full mt-1',
            day: 'w-10 h-10 p-0 flex items-center justify-center',

            today: 'rounded-full bg-[#FAFAFA]',
            outside: 'opacity-100',
            disabled: 'opacity-100',
            hidden: 'invisible',
          }}
          components={{
            Nav: ({ onPreviousClick, onNextClick }) => (
              <div className="absolute top-4 right-0 left-0 flex items-center justify-between px-4">
                <Button
                  type="button"
                  onClick={onPreviousClick}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent hover:bg-[#FAFAFA]"
                >
                  <ChevronLeftIcon size={20} className="stroke-[#A4A4A4] hover:stroke-[#333]" />
                </Button>
                <Button
                  type="button"
                  onClick={onNextClick}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent hover:bg-[#FAFAFA]"
                >
                  <ChevronRightIcon size={20} className="hover:stroke -[#333] stroke-[#A4A4A4]" />
                </Button>
              </div>
            ),
            DayButton: ({ modifiers, ...props }) => (
              <button
                {...props}
                className={cn(
                  'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-sm font-normal tracking-[-0.42px] transition-colors hover:bg-[#FAFAFA]',
                  modifiers.outside ? 'text-[#A4A4A4]' : 'text-[#333]',
                  modifiers.disabled && 'cursor-not-allowed text-[#A4A4A4]',
                  modifiers.today && !modifiers.selected && 'bg-[#FAFAFA] font-medium',
                  modifiers.selected && 'bg-[#FF8442] font-medium text-white! hover:bg-[#FF8442]',
                )}
              />
            ),
          }}
        />

        {/* 하단 취소/확인 버튼 */}
        <div className="flex gap-3 px-4 pb-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onCancel();
              setOpen(false);
            }}
            className="flex flex-1 items-center justify-center rounded-full border border-[#CCC] py-[10px] text-sm font-semibold text-[#737373]"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm(date);
              setOpen(false);
            }}
            className="flex flex-1 items-center justify-center rounded-full bg-[#FF8442] py-[10px] text-sm font-semibold text-white"
          >
            확인
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}