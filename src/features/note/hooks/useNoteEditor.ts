import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

interface UseNoteEditorOptions {
  content: string;
  onContentChange: (html: string) => void;
}

export function useNoteEditor({ content, onContentChange }: UseNoteEditorOptions) {
  return useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: '이 곳을 통해 노트 작성을 시작해주세요',
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });
}
