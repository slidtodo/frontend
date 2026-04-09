import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { useEffect, useRef } from 'react';

interface UseNoteEditorOptions {
  content: string;
  onContentChange: (html: string) => void;
}

export function useNoteEditor({ content, onContentChange }: UseNoteEditorOptions) {
  const { t } = useLanguage();
  const placeholderRef = useRef(t.note.placeholder);

  useEffect(() => {
    placeholderRef.current = t.note.placeholder;
  }, [t.note.placeholder]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: () => placeholderRef.current,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.view.dispatch(editor.view.state.tr);
  }, [editor, t.note.placeholder]);

  return editor;
}
