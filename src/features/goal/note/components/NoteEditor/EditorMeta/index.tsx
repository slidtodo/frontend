import Tag from '@/shared/components/Tag';
import { formatDate } from '@/shared/utils/utils';
import { CalendarIcon, FlagIcon, Hash, SquareCheck } from 'lucide-react';

/**
 * 부모 컴포넌트에서 사용법
 *  <EditorMeta
      goal={{
        title: '올해 안에 풀스택 개발자 되기',
      }}
      todos={{
        title: 'React 컴포넌트 설계 공부하기',
        done: false,
      }}
      tags={[
        { id: '1', string: 'React', variant: 'green' },
        { id: '2', string: 'TypeScript', variant: 'purple' },
        { id: '3', string: '공부', variant: 'orange' },
      ]}
    />
 */
interface MetaTag {
  id: string;
  string: string;
  variant?: 'green' | 'orange' | 'purple';
}

interface EditorMetaProps {
  goal: {
    title: string;
  };
  todos: {
    title: string;
    done: boolean;
  };
  tags: MetaTag[];
}

export default function EditorMeta({ goal, todos, tags }: EditorMetaProps) {
  const todosTagLabel = todos.done ? 'DONE' : 'TODO';
  const today = formatDate(new Date());

  return (
    <div className="flex w-full flex-col gap-3 md:flex-row">
      {/* 왼쪽 — 목표 / 할 일 */}
      <div className="flex flex-1 flex-col gap-3 md:w-1/2">
        <MetaRow icon={<FlagIcon size={12} className="text-base font-semibold text-[#A4A4A4]" />} label="목표">
          <span className="line-clamp-1 text-sm font-normal text-[#333333]">{goal.title}</span>
        </MetaRow>
        <MetaRow icon={<SquareCheck size={12} className="text-base font-semibold text-[#A4A4A4]" />} label="할 일">
          <div className="flex items-center gap-2">
            <span className="line-clamp-1 text-sm font-normal text-[#333333]">{todos.title}</span>
            <Tag string={todosTagLabel} className="text-xs rounded-md px-[5.5px] py-[3px] font-semibold" />
          </div>
        </MetaRow>
      </div>

      {/* 오른쪽 — 작성일 / 태그 */}
      <div className="flex flex-1 flex-col gap-3 md:w-1/2">
        <MetaRow
          icon={<CalendarIcon size={12} className="line-clamp-1 text-base font-semibold text-[#A4A4A4]" />}
          label="작성일"
        >
          <span className="line-clamp-1 text-sm font-normal text-[#333333]">{today}</span>
        </MetaRow>

        <MetaRow icon={<Hash size={12} className="text-base font-semibold text-[#A4A4A4]" />} label="태그">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {tags.map((tag) => (
              <Tag
                key={tag.id}
                string={tag.string}
                variant={tag.variant}
                className="overflow-w-auto rounded-full border px-2 py-1 text-xs font-medium whitespace-nowrap"
              />
            ))}
          </div>
        </MetaRow>
      </div>
    </div>
  );
}

// 아이콘 + 라벨 + 값 반복
function MetaRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex shrink-0 items-center justify-center gap-1 pr-3">
        <span>{icon}</span>
        <span className="text-sm leading-5 font-medium text-[#a4a4a4]">{label}</span>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
