'use client';

import PageHeader from '@/shared/components/PageHeader';
import NoteEditor from '@/features/goal/note/components/NoteEditor';
import Button from '@/shared/components/Button';
import { useDraftNoteRestore } from '@/features/note/hooks/useDraftNoteRestore';
import { useState } from 'react';
import { useDraftNote } from '@/features/note/hooks/useDraftNote';
import { usePostNote } from '@/features/note/hooks/usePostNote';
import { useToastStore } from '@/shared/stores/useToastStore';
import { redirect, useSearchParams } from 'next/navigation';
import DraftNoteToast from '@/features/note/components/DraftNoteToast.tsx';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from '@/features/goal/note/components/NoteEditor/EditorToolbar';
import { createPortal } from 'react-dom';

export default function Page() {
  const searchParams = useSearchParams();
  const todoIdParam = searchParams.get('todoId');
  const todoId = todoIdParam ? Number(todoIdParam) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [linkUrl, setLinkUrl] = useState<string | null>(null);

  const { saveDraft } = useDraftNote();
  const { showToast } = useToastStore();

  const { mutate: createNote, isPending } = usePostNote({
    onError: () => {
      showToast('노트 작성에 실패했습니다', 'fail');
    },
  });

  const breakpoint = useBreakpoint();

  const { showDraftToast, handleCloseToast, handleToastLoad } = useDraftNoteRestore({
    onRestore: (saved) => {
      setTitle(saved.title);
      setContent(saved.content);
      setCreatedAt(saved.savedAt);
      setLinkUrl(saved.linkUrl ?? null);
    },
  });

  const handleSaveDraft = () => {
    try {
      const body = {
        todoId,
        title,
        content,
        ...(linkUrl ? { linkUrl } : {}),
      };
      saveDraft(body);
      showToast('임시 저장이 완료되었습니다 ・ 1초전', 'success');
    } catch (error) {
      showToast('임시 저장이 실패했습니다', 'fail');
      console.error('임시 저장 실패:', error);
    }
  };

  const handleSubmit = () => {
    if (!todoId) {
      showToast('먼저 할 일을 등록해주세요', 'fail');
      redirect('/dashboard/all-todo');
    }

    const body = {
      todoId,
      title,
      content,
      ...(linkUrl ? { linkUrl } : {}),
    };
    createNote(body);
  };

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

  return (
    <div className="mx-auto flex h-full w-full max-w-[768px] flex-col">
      {breakpoint === 'mobile' &&
        createPortal(
          <EditorToolbar editor={editor} onLinkUrlChange={setLinkUrl} />,
          document.getElementById('mobile-toolbar-slot') ?? document.body,
        )}
      {breakpoint !== 'mobile' && (
        <section className="mb-0 flex shrink-0 items-center justify-between md:mt-4 md:mb-3 md:gap-4 lg:mt-10 lg:mb-[22px]">
          <PageHeader title={'노트 작성하기'} />
          <div className="flex gap-2">
            <div className="relative">
              <Button
                onClick={handleSaveDraft}
                variant="secondary"
                className="cursor-pointer text-sm md:h-10 md:px-[27px]"
              >
                임시저장
              </Button>
              {showDraftToast && <DraftNoteToast onLoad={handleToastLoad} onClose={handleCloseToast} />}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              variant="primary"
              className="cursor-pointer text-sm md:h-10 md:px-[27px]"
            >
              {isPending ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </section>
      )}

      <section className="flex-1 lg:mb-[30px]">
        <NoteEditor
          editor={editor}
          title={title}
          onTitleChange={setTitle}
          createdAt={createdAt}
          linkUrl={linkUrl}
          onLinkUrlChange={setLinkUrl}
        />
      </section>
    </div>
  );
}
