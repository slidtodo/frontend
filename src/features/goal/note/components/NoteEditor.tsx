'use client';

import clsx from 'clsx';
import EditorToolbar from './EditorToolbar';

export default function NoteEditor() {
  return (
    <div
      className={clsx(
        'flex h-full items-center bg-[#FFF]',
        'gap-[10px] rounded-3xl p-4',
        'md:rounded-4xl md:px-[30px] md:py-8',
      )}
    >
      {/** 에디터 툴바 */}
      <EditorToolbar />
    </div>
  );
}
