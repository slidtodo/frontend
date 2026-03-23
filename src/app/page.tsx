'use client';
import LinkEmbed from '@/features/goal/note/components/NoteEditor/LinkEmbed';
import LinkEmbedPreview from '@/features/goal/note/components/NoteEditor/LinkEmbed/LinkEmbedPreview';
import { useTodoCreateModal } from '@/features/todo/hooks/useTodoCreateModal';
import { useState } from 'react';

export default function Home() {
  const [linkUrl, setLinkUrl] = useState<string | null>('https://www.codeit.kr');
  const {openTodoCreateModal} = useTodoCreateModal();

  return (
    <div>
      {linkUrl && (
        <LinkEmbed
          url={linkUrl}
          onRemove={() => setLinkUrl(null)}
        />
      )}
      {/* LinkEmbedPreview는 따로 렌더링 */}
      {linkUrl && <LinkEmbedPreview url={linkUrl} />}
      <button onClick={openTodoCreateModal}>모달 열기</button>
    </div>
  );
}