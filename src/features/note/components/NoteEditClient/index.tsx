'use client';

import PageHeader from '@/shared/components/PageHeader';
import NoteEditor from '@/features/note/components/NoteEditor';
import Button from '@/shared/components/Button';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { noteQueries, goalQueries, todoQueries } from '@/lib/queryKeys';
import { usePatchNote } from '@/features/note/hooks/usePatchNote';
import { useToastStore } from '@/shared/stores/useToastStore';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from '@/features/note/components/NoteEditor/EditorToolbar';
import { createPortal } from 'react-dom';

interface NoteEditClientProps {
  noteId: number;
  goalId: number;
}

export default function NoteEditClient({ noteId, goalId }: NoteEditClientProps) {
  const { data: note } = useQuery(noteQueries.detail(noteId));
  const { data: goal } = useQuery(goalQueries.detail(goalId));
  const { data: todo } = useQuery({
    ...todoQueries.detail(note?.todoId ?? 0),
    enabled: note?.todoId != null,
  });

  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [linkUrl, setLinkUrl] = useState<string | null>(note?.linkUrl ?? null);

  const { showToast } = useToastStore();

  const { mutate: patchNote, isPending } = usePatchNote(noteId, goalId, {
    onError: () => showToast('노트 수정에 실패했습니다', 'fail'),
  });

  const breakpoint = useBreakpoint();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: '이 곳을 통해 노트 작성을 시작해주세요' }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleSubmit = () => {
    patchNote({
      title,
      content,
      ...(linkUrl ? { linkUrl } : {}),
    });
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[768px] flex-col">
      {breakpoint === 'mobile' &&
        createPortal(
          <EditorToolbar editor={editor} onLinkUrlChange={setLinkUrl} />,
          document.getElementById('mobile-toolbar-slot') ?? document.body,
        )}
      {breakpoint !== 'mobile' && (
        <section className="mb-0 flex shrink-0 items-center justify-between md:mt-4 md:mb-3 md:gap-4 lg:mt-10 lg:mb-[22px]">
          <PageHeader title="노트 수정하기" />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              variant="primary"
              className="cursor-pointer text-sm md:h-10 md:px-[27px]"
            >
              {isPending ? '수정 중...' : '수정하기'}
            </Button>
          </div>
        </section>
      )}

      <section className="flex-1 lg:mb-[30px]">
        <NoteEditor
          editor={editor}
          title={title}
          onTitleChange={setTitle}
          createdAt={note?.createdAt ?? ''}
          linkUrl={linkUrl}
          onLinkUrlChange={setLinkUrl}
          goal={goal}
          todo={todo}
        />
      </section>
    </div>
  );
}
