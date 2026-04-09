import { TodoResponse } from '@/shared/lib/api/fetchTodos';
import CalendarEventItem from '@/features/calendar/components/CalendarEventItem';
import clsx from 'clsx';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';

interface CalendarCellProps {
  day: number | null;
  isToday: boolean;
  todos: TodoResponse[];
  isLastRow: boolean;
}

const MAX_VISIBLE = 3;

export default function CalendarCell({ day, isToday, todos, isLastRow }: CalendarCellProps) {
  const overflow = todos.length - MAX_VISIBLE;
  const breakpoint = useBreakpoint();
  const isDotEvent = breakpoint === 'mobile' || breakpoint === 'tablet';

  return (
    <div
      className={clsx(
        'border-border-secondary relative min-h-25 p-1.5 md:min-h-30 md:p-2',
        !isLastRow && 'border-b',
        'border-r nth-[7n]:border-r-0',
      )}
    >
      {day != null && (
        <>
          <div className="mb-1.5 flex justify-start">
            <span
              className={clsx(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                isToday ? 'bg-bearlog-500 text-white' : 'text-gray-600',
              )}
            >
              {day}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            {isDotEvent ? (
              <div className="flex gap-0.5">
                {todos.slice(0, MAX_VISIBLE).map((todo) => (
                  <div key={todo.id} className="flex gap-1 p-[1px]">
                    <div
                      className={clsx('h-[6px] w-[6px] rounded-full', todo.done ? 'bg-bearlog-500' : 'bg-gray-400')}
                    />
                  </div>
                ))}
              </div>
            ) : (
              todos.slice(0, MAX_VISIBLE).map((todo) => <CalendarEventItem key={todo.id} todo={todo} />)
            )}
            {overflow > 0 && <span className="text-xs text-gray-400">+{overflow}</span>}
          </div>
        </>
      )}
    </div>
  );
}
