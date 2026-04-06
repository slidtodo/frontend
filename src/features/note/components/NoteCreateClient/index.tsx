'use client';

import PageHeader from '@/shared/components/PageHeader';
import NoteEditor from '@/features/note/components/NoteEditor';
import Button from '@/shared/components/Button';
import { useDraftNoteRestore } from '@/features/note/hooks/useDraftNoteRestore';
import { useCallback, useEffect, useState } from 'react';
import { useDraftNote } from '@/features/note/hooks/useDraftNote';
import { usePostNote } from '@/features/note/hooks/usePostNote';
import { useToastStore } from '@/shared/stores/useToastStore';
import { useRouter } from 'next/navigation';
import DraftNoteToast from '@/features/note/components/DraftNoteToast';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from '@/features/note/components/NoteEditor/EditorToolbar';
import { createPortal } from 'react-dom';
import { TodoResponse } from '@/shared/lib/api/fetchTodos';
import { GoalDetailResponse } from '@/shared/lib/api/fetchGoals';
import { useMobileHeaderStore } from '@/shared/stores/useMobileHeaderStore';

interface NoteCreateClientProps {
  goal: GoalDetailResponse;
  todo: TodoResponse | null;
}

export default function NoteCreateClient({ goal, todo }: NoteCreateClientProps) {
  const todoId = todo?.id ?? null;

  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [linkUrl, setLinkUrl] = useState<string | null>(null);

  const draftKey = todoId != null ? `note_draft_todo_${todoId}` : `note_draft_goal_${goal.id}`;

  const { saveDraft } = useDraftNote(draftKey);
  const { showToast } = useToastStore();
  const setSlot = useMobileHeaderStore((s) => s.setSlot);

  const { mutate: createNote, isPending } = usePostNote({
    onError: () => {
      showToast('노트 작성에 실패했습니다', 'fail');
    },
  });

  const breakpoint = useBreakpoint();

  const { showDraftToast, handleCloseToast, handleToastLoad } = useDraftNoteRestore({
    key: draftKey,
    onRestore: (saved) => {
      setTitle(saved.title);
      editor?.commands.setContent(saved.content);
      setCreatedAt(saved.savedAt);
      setLinkUrl(saved.linkUrl ?? null);
    },
  });

  const handleSaveDraft = useCallback(() => {
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
  }, [todoId, title, content, linkUrl, saveDraft, showToast]);

  const handleSubmit = useCallback(() => {
    if (!todoId) {
      showToast('먼저 할 일을 등록해주세요', 'fail');
      router.push('/dashboard/all-todo');
      return;
    }

    const body = {
      todoId,
      title,
      content,
      ...(linkUrl ? { linkUrl } : {}),
    };
    createNote(body);
  }, [todoId, title, content, linkUrl, createNote, showToast, router]);

  useEffect(() => {
    if (breakpoint !== 'mobile') return;
    setSlot(
      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            type="button"
            className="px-1.5 text-[#737373] transition-all duration-200 hover:text-[#FF8442]"
            onClick={handleSaveDraft}
          >
            임시저장
          </button>
          {showDraftToast && <DraftNoteToast onLoad={handleToastLoad} onClose={handleCloseToast} />}
        </div>
        <button
          type="button"
          className="px-1.5 text-[#737373] transition-all duration-200 hover:text-[#FF8442]"
          onClick={handleSubmit}
        >
          등록
        </button>
      </div>,
    );
    return () => setSlot(null);
  }, [breakpoint, handleSaveDraft, handleSubmit, showDraftToast, handleToastLoad, handleCloseToast, setSlot]);

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
        <section className="mb-0 flex shrink-0 items-center justify-between md:mb-3 md:gap-4 lg:mb-[22px]">
          <PageHeader title={'노트 작성하기'} />
          <div className="flex gap-2">
            <div className="relative">
              <Button onClick={handleSaveDraft} variant="secondary" className="px-[27px] py-[10px] text-sm">
                임시저장
              </Button>
              {showDraftToast && <DraftNoteToast onLoad={handleToastLoad} onClose={handleCloseToast} />}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isPending || title.trim() === '' || !editor || editor.isEmpty}
              variant="primary"
              className="px-[27px] py-[10px] text-sm"
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
          goal={goal}
          todo={todo}
        />
      </section>
    </div>
  );
}
