'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { todoQueries, goalQueries, userQueries } from '@/shared/lib/query/queryKeys';
import CalendarGrid from '@/features/calendar/components/CalendarGrid';
import PageHeader from '@/shared/components/PageHeader';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import Dropdown from '@/shared/components/Dropdown';
import CalendarEventItem from '../CalendarEventItem';

export default function CalendarClient() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [goalId, setGoalId] = useState<number | undefined>(undefined);

  const { data: calendarData } = useQuery(todoQueries.calendar({ year, month, goalId }));
  const { data: goalList } = useQuery(goalQueries.list());
  const { data: user } = useQuery(userQueries.current());

  const todos = calendarData?.todos ?? [];

  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const selectedDateKey = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDate = `${year}. ${String(month).padStart(2, '0')}. ${String(selectedDay).padStart(2, '0')}`;
  const todayTodos = todos.filter((todo) => todo.dueDate?.slice(0, 10) === selectedDateKey);

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const isDesktop = breakpoint === 'desktop';

  const goalFilterItems = [
    { label: '전체 목표', value: '' },
    ...(goalList?.goals ?? []).filter((g) => g.id != null).map((g) => ({ label: g.title ?? '', value: String(g.id) })),
  ];

  const isCurrentMonth = (y: number, m: number) =>
    y === today.getFullYear() && m === today.getMonth() + 1;

  const prevMonth = () => {
    const newYear = month === 1 ? year - 1 : year;
    const newMonth = month === 1 ? 12 : month - 1;
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDay(isCurrentMonth(newYear, newMonth) ? today.getDate() : null);
  };

  const nextMonth = () => {
    const newYear = month === 12 ? year + 1 : year;
    const newMonth = month === 12 ? 1 : month + 1;
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDay(isCurrentMonth(newYear, newMonth) ? today.getDate() : null);
  };

  return (
    <>
      {!isMobile && <PageHeader title={`${user?.nickname ?? ''}님의 캘린더`} className="md:mb-[32px] lg:mb-5" />}
      <div className="border-border-secondary flex w-full flex-col bg-white md:rounded-t-4xl md:rounded-b-4xl md:border">
        <div className="flex flex-col items-center gap-5 px-4 py-5 lg:flex-row lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="cursor-pointer rounded-full p-1 hover:bg-gray-100">
              <ChevronsLeftIcon size={20} className="text-gray-500" />
            </button>
            <span className="text-lg font-semibold text-gray-800">
              {year}년 {month}월
            </span>
            <button onClick={nextMonth} className="cursor-pointer rounded-full p-1 hover:bg-gray-100">
              <ChevronsRightIcon size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="w-full lg:max-w-[350px]">
            <Dropdown
              className="h-12 border-gray-100 bg-gray-50"
              items={goalFilterItems}
              selectedValue={goalId !== undefined ? String(goalId) : ''}
              onSelectItem={(item) => setGoalId(item.value === '' ? undefined : Number(item.value))}
            />
          </div>
        </div>

        <CalendarGrid year={year} month={month} todos={todos} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        {!isDesktop && (
          <div className="border-border-secondary flex flex-col border-t px-4 py-5">
            <h3 className="text-sm font-semibold pb-4">{selectedDate}</h3>
            <div className="flex w-full flex-col gap-[6px] last:pb-[34px]">
              {todayTodos.map((todo) => (
                <CalendarEventItem key={todo.id} todo={todo} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
