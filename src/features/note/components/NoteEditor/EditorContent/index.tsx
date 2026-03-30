'use client';

import clsx from 'clsx';
import { Editor, EditorContent as TiptapEditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import LinkEmbed from '../LinkEmbed';

type EditorContentProps = {
  editor?: Editor | null;
  content?: string;
  className?: string;
  readOnly?: boolean;
  linkUrl?: string | null;
  onLinkUrlChange?: (value: string | null) => void;
};

export default function EditorContent({
  editor = null,
  content,
  className,
  linkUrl,
  onLinkUrlChange,
  readOnly = false,
}: EditorContentProps) {
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  const text = editor?.getText() ?? '';
  const withSpace = text.length;
  const withoutSpace = text.replace(/\s/g, '').length;

  return (
    <section className={clsx('flex justify-between min-h-0 flex-1 flex-col gap-2 pt-[14px] lg:pt-[10px]', className)}>
      {readOnly ? (
        <div
          className="h-full w-full flex-1 cursor-default text-base font-normal leading-6 tracking-[-0.02em] text-[#333333]"
          dangerouslySetInnerHTML={{ __html: content ?? '' }}
        />
      ) : (
        <>
          {linkUrl && <LinkEmbed url={linkUrl} onRemove={() => onLinkUrlChange?.(null)} />}
          <TiptapEditorContent
            editor={editor}
            className={clsx(
              'max-h-98.25 md:max-h-166 lg:max-h-134.25 min-h-0 w-full overflow-y-auto',
              '[&_.ProseMirror]:min-h-75',
              '[&_.ProseMirror]:outline-none',
              '[&_.ProseMirror]:border-none',
              '[&_.ProseMirror]:text-base',
              '[&_.ProseMirror]:font-normal',
              '[&_.ProseMirror]:leading-6',
              '[&_.ProseMirror]:tracking-[-0.02em]',
              '[&_.ProseMirror]:text-[#333333]',
              '[&_.ProseMirror_ul]:list-disc',
              '[&_.ProseMirror_ul]:pl-5',
              '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
              '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400',
              '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
              '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
              '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
            )}
          />
        </>
      )}
      {!readOnly && (
        <p className="text-right text-xs font-normal text-[#A4A4A4]">
          공백포함 {withSpace}자 | 공백제외 {withoutSpace}자
        </p>
      )}
    </section>
  );
}
