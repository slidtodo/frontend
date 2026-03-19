'use client';

import clsx from 'clsx';
import EditorToolbar from './EditorToolbar';
import EditorTitle from './EditorTitle';
import { useState } from 'react';
import EditorMeta from './EditorMeta';
import EditorContent from './EditorContent';

export default function NoteEditor() {
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 30) {
      // @TODO 토스트 할지 말지 결정
      setTitleInput(value);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentInput(e.target.value);
  };

  return (
    <div
      className={clsx(
        'flex h-full w-full min-w-0 flex-col bg-[#FFF]',
        'gap-[10px] rounded-3xl p-4',
        'md:rounded-4xl md:px-[30px] md:py-8',
      )}
    >
      {/** 에디터 툴바 */}
      <EditorToolbar />

      <section className="border-b border-b-[#DDD] pb-4 md:pt-[19px] md:pb-5 lg:pb-7">
        <EditorTitle title={titleInput} onChange={handleTitleChange} />
        <EditorMeta
          goal={{
            title: '올해 안에 풀스택 개발자 되기',
          }}
          todos={{
            title: 'React 컴포넌트 설계 공부하기',
            done: false,
          }}
          tags={[
            { id: '1', string: 'React', variant: 'green' },
            { id: '2', string: 'TypeScript', variant: 'purple' },
            { id: '3', string: '공부', variant: 'orange' },
            { id: '4', string: '공부', variant: 'orange' },
            { id: '5', string: '공부', variant: 'orange' },
            { id: '6', string: '공부', variant: 'orange' },
            { id: '7', string: '공부', variant: 'orange' },
            { id: '8', string: '공부', variant: 'orange' },
            { id: '9', string: '공부', variant: 'orange' },
            { id: '10', string: '공부', variant: 'orange' },
          ]}
        />
      </section>
      <EditorContent content={contentInput} onChange={handleContentChange} />
    </div>
  );
}
