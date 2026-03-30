'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { noteQueries, goalQueries } from '@/lib/queryKeys';
import { fetchNotes } from '@/lib/api/fetchNotes';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/shared/stores/useToastStore';
import EditorTitle from '@/features/note/components/NoteEditor/EditorTitle';
import EditorMeta from '@/features/note/components/NoteEditor/EditorMeta';
import EditorContent from '@/features/note/components/NoteEditor/EditorContent';
import EllipsisButton from '@/features/note/components/EllipsisButton';
import { mapNoteTagsFromSource } from '@/features/note/utils/utils';

interface NoteDetailClientProps {
  noteId: number;
  goalId: number;
}

export default function NoteDetailClient({ noteId, goalId }: NoteDetailClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const { data: note } = useQuery(noteQueries.detail(noteId));
  const { data: goal } = useQuery(goalQueries.detail(goalId));

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => fetchNotes.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries(noteQueries.detail(noteId));
      router.back();
    },
    onError: () => showToast('노트 삭제에 실패했습니다', 'fail'),
  });

  if (!note) return null;

  const tags = mapNoteTagsFromSource({
    source: note.source,
    tags: note.todo?.tags,
    sourceItemId: note.sourceItemId,
    status: note.status,
  });

  return (
    <div className="p-5 md:p-10">
      <div className="flex items-center justify-between">
        <EditorTitle title={note.title ?? ''} readOnly />
        <EllipsisButton
          items={[
            { label: '수정', value: 'edit' },
            { label: '삭제', value: 'delete' },
          ]}
          onDelete={handleDelete}
        />
      </div>
      <EditorMeta
        goal={{ title: goal?.title ?? '' }}
        todos={{ title: note.todo?.title ?? '', done: note.todo?.done ?? false }}
        tags={tags}
        createdAt={note.createdAt ?? ''}
      />
      <hr className="mt-4 mb-5 border-[#DDD] md:mt-6" />
      <EditorContent content={note.content ?? ''} readOnly />
    </div>
  );
}
