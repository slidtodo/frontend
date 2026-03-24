'use client';

import PageHeader from '@/shared/components/PageHeader';
import NoteEditor from '@/features/goal/note/components/NoteEditor';
import Button from '@/shared/components/Button';
import { useDraftNoteRestore } from '@/features/note/hooks/useDraftNoteRestore';
import { useState } from 'react';
import { useDraftNote } from '@/features/note/hooks/useDraftNote';
import DraftNoteToast from '@/features/note/components/DraftNoteToast.tsx';
import Toast from '@/shared/components/Toast';

export default function Page() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [linkUrl, setLinkUrl] = useState<string | null>(null);

  const { saveDraft } = useDraftNote();

  const { showToast, showSuccessToast, handleCloseToast, handleToastLoad } =
    useDraftNoteRestore({
      onRestore: (saved) => {
        setTitle(saved.title);
        setContent(saved.content);
        setCreatedAt(saved.savedAt);
        setLinkUrl(saved.linkUrl ?? null);
      },
    });

  return (
    <div className="mx-auto flex h-full w-full max-w-[768px] flex-col">
      <section className="mb-0 flex shrink-0 items-center justify-between md:mt-4 md:mb-3 md:gap-4 lg:mt-10 lg:mb-[22px]">
        <PageHeader title={'노트 작성하기'} />
        <div className="flex gap-2">
          <div className="relative">
            <Button
              onClick={() => saveDraft({ title, content, linkUrl: linkUrl ?? undefined })}
              variant="secondary"
              className="cursor-pointer text-sm md:h-10 md:px-[27px]"
            >
              임시저장
            </Button>
            {showToast && <DraftNoteToast onLoad={handleToastLoad} onClose={handleCloseToast} />}
            {showSuccessToast && <Toast onLoad={() => showSuccessToast}>임시 저장된 노트를 불러왔어요</Toast>}
          </div>
          <Toast onLoad={() => showSuccessToast}>임시 저장된 노트를 불러왔어요</Toast>
          <Button variant="primary" className="cursor-pointer text-sm md:h-10 md:px-[27px]">
            등록하기
          </Button>
        </div>
      </section>

      <section className="flex-1 md:mb-[30px] lg:mb-[62px]">
        <NoteEditor
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
          createdAt={createdAt}
          linkUrl={linkUrl}
          onLinkUrlChange={setLinkUrl}
        />
      </section>
    </div>
  );
}
