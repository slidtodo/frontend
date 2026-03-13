'use client';

import { PopupModal } from '@/shared/components/Modal/PopupModal';
import { useModalStore } from '@/shared/stores/useModalStore';

export default function Home() {
  const { openModal } = useModalStore();
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() =>
          openModal(
            <PopupModal onConfirm={() => console.log('goalDelete 팝업 제출')} variant={{ type: 'goalDelete' }} />,
          )
        }
      >
        첫번째
      </button>
      <button
        onClick={() =>
          openModal(
            <PopupModal onConfirm={() => console.log('noteDelete 팝업 제출')} variant={{ type: 'noteDelete' }} />,
          )
        }
      >
        두번째
      </button>
      <button
        onClick={() =>
          openModal(
            <PopupModal
              onConfirm={() => console.log('noteLoad 팝업 제출')}
              variant={{ type: 'noteLoad', noteTitle: '자바스크립트' }}
            />,
          )
        }
      >
        세번째
      </button>
      <button
        onClick={() =>
          openModal(
            <PopupModal onConfirm={() => console.log('postCancel 팝업 제출')} variant={{ type: 'postCancel' }} />,
          )
        }
      >
        네번째
      </button>
    </div>
  );
}
