'use client';

import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { useModalStore } from '@/shared/stores/useModalStore';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { todoQueries } from '@/shared/lib/query/queryKeys';
import Button from '@/shared/components/Button';
import FormField from '@/shared/components/FormField';
import Dropdown from '@/shared/components/Dropdown';

interface NoteCreateModalProps {
  title: string;
  onConfirm: (todoId: number) => void;
}

export default function NoteCreateModal({ title, onConfirm }: NoteCreateModalProps) {
  const { closeModal } = useModalStore();
  const { t } = useLanguage();
  const resolvedTitle = title ?? t.modal.linkTitle;

  const [selectedTodoId, setSelectedTodoId] = useState<string>('');

  const { data: todoList } = useQuery(todoQueries.list());
  const todoItems = (todoList?.todos ?? []).map((todo) => ({
    label: todo.title,
    value: String(todo.id),
  }));

  return (
    <div className="w-85.75 rounded-3xl bg-white p-4 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] md:w-114 md:rounded-[40px] md:p-8">
      <div className="flex flex-col">
        <div className="mb-6 flex w-full items-center justify-between self-stretch md:mb-8">
          <h2 className="text-base font-semibold text-slate-800 md:text-xl">{resolvedTitle}</h2>
          <XIcon className="cursor-pointer text-slate-400" size={24} onClick={closeModal} />
        </div>

        <FormField label="할 일 선택" required className="mb-8 md:mb-10">
          <Dropdown
            placeholder="할 일을 선택해 주세요."
            items={todoItems}
            selectedValue={selectedTodoId}
            onSelectItem={(item) => setSelectedTodoId(item.value)}
          />
        </FormField>

        <Button
          variant="primary"
          className="px-4.5 py-2.5 text-sm font-semibold md:py-3.5 md:text-[18px]"
          onClick={() => {
            if (!selectedTodoId) return;
            onConfirm(Number(selectedTodoId));
            closeModal();
          }}
        >
          {t.modal.confirm}
        </Button>
      </div>
    </div>
  );
}
