'use client';

import CalendarGrid from '@/features/calendar/components/CalendarGrid';
import CalendarHeader from '@/features/calendar/components/CalendarHeader';
import CalendarDayTodoList from '@/features/calendar/components/CalendarDayTodoList';
import PageHeader from '@/shared/components/PageHeader';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import Dropdown from '@/shared/components/Dropdown';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';

export default function CalendarClient() {
  const {
    year,
    month,
    goalId,
    setGoalId,
    selectedDay,
    setSelectedDay,
    selectedDate,
    selectedDayTodos,
    todos,
    goalFilterItems,
    user,
    prevMonth,
    nextMonth,
  } = useCalendar();

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const isDesktop = breakpoint === 'desktop';

  return (
    <>
      {!isMobile && <PageHeader title={`${user?.nickname ?? ''}님의 캘린더`} className="md:mb-[32px] lg:mb-5" />}
      <div className="border-border-secondary flex w-full flex-col bg-white md:rounded-t-4xl md:rounded-b-4xl md:border">
        <CalendarHeader
          year={year}
          month={month}
          goalId={goalId}
          goalFilterItems={goalFilterItems}
          onPrev={prevMonth}
          onNext={nextMonth}
          onGoalChange={(item) => setGoalId(item.value === '' ? undefined : Number(item.value))}
        />

        <CalendarGrid year={year} month={month} todos={todos} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        {!isDesktop && (
          <CalendarDayTodoList selectedDate={selectedDate} todos={selectedDayTodos} />
        )}
      </div>
    </>
  );
}
