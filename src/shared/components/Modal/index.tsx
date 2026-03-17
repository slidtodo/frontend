// Modal/index.tsx
'use client';
import { useModalStore } from '@/shared/stores/useModalStore';
import { useRef, useEffect, MouseEvent } from 'react';
import { createPortal } from 'react-dom';

export const Modal = () => {
  const { content, isOpen, closeModal } = useModalStore();

  // 모달의 backdrop을 가리키는 ref
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열리면 스크롤 비활성화
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 모달 backdrop을 클릭한 경우 모달을 닫음
  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  // 모달이 열려있지 않거나 서버에서 실행되는 경우를 차단
  if (!isOpen || typeof window === 'undefined') return null;

  // Portal을 생성하고 내부에서 모달 content를 렌더링
  return createPortal(
    <div
      ref={modalRef}
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div onClick={(e) => e.stopPropagation()}>{content}</div>
    </div>,
    document.body,
  );
};
