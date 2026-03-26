'use client';

import clsx from 'clsx';
import EditorToolbar from './EditorToolbar';
import EditorTitle from './EditorTitle';
import EditorMeta from './EditorMeta';
import EditorContent from './EditorContent';
import { useBreakpoint } from '@/shared/hooks/useBreakPoint';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

interface NoteEditorProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  createdAt: string;
  linkUrl?: string | null;
  onLinkUrlChange?: (value: string | null) => void;
}

export default function NoteEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  createdAt,
  linkUrl,
  onLinkUrlChange,
}: NoteEditorProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 30) {
      onTitleChange(value);
    }
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
      onContentChange(editor.getHTML());
    },
  });

  const breakpoint = useBreakpoint();

  return (
    <div
      className={clsx(
        'flex h-full w-full min-w-0 flex-col bg-[#FFF]',
        'gap-[10px] rounded-3xl p-4',
        'md:rounded-4xl md:px-[30px] md:py-8',
      )}
    >
      {breakpoint !== 'mobile' && <EditorToolbar editor={editor} onLinkUrlChange={onLinkUrlChange} />}

      <section className="border-b border-b-[#DDD] pb-4 md:pt-[19px] md:pb-5 lg:pb-7">
        <EditorTitle title={title} onChange={handleTitleChange} />
        <EditorMeta
          goal={{ title: '올해 안에 풀스택 개발자 되기' }}
          todos={{ title: 'React 컴포넌트 설계 공부하기', done: false }}
          tags={[
            { id: '1', string: 'React', variant: 'green' },
            { id: '2', string: 'TypeScript', variant: 'purple' },
            { id: '3', string: '공부', variant: 'orange' },
          ]}
          createdAt={createdAt}
        />
      </section>
      <EditorContent editor={editor} linkUrl={linkUrl} onLinkUrlChange={onLinkUrlChange} />
    </div>
  );
}
