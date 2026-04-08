'use client';

import { useModalStore } from '@/shared/stores/useModalStore';
import { OctagonAlert } from 'lucide-react';
import Button from '../../Button';

/**
 * PopupModal
 *
 * 확인/취소가 필요한 팝업 모달 컴포넌트
 *
 * @example 기본 사용법
 * ```tsx
 *
 * // 1. 목표 삭제
 * openModal(
 *   <PopupModal
 *     variant={{ type: 'goalDelete' }}
 *     onConfirm={() => handleDeleteGoal()}
 *   />
 * );
 *
 * // 2. 노트 삭제
 * openModal(
 *   <PopupModal
 *     variant={{ type: 'noteDelete' }}
 *     onConfirm={() => handleDeleteNote()}
 *   />
 * );
 *
 * // 3. 노트 불러오기 - noteTitle 필수
 * openModal(
 *   <PopupModal
 *     variant={{ type: 'noteLoad', noteTitle: '나의 첫 번째 노트' }}
 *     onConfirm={() => handleLoadNote()}
 *   />
 * );
 *
 * // 4. 게시물 작성 취소
 * openModal(
 *   <PopupModal
 *     variant={{ type: 'postCancel' }}
 *     onConfirm={() => handleCancel()}
 *   />
 * );
 * ```
 *
 * @param variant - 모달 유형
 * | type          | 추가 props            | 설명             |
 * |---------------|-----------------------|------------------|
 * | goalDelete    | 없음                  | 목표 삭제 확인   |
 * | noteDelete    | 없음                  | 노트 삭제 확인   |
 * | noteLoad      | noteTitle: string     | 노트 불러오기    |
 * | postCancel    | 없음                  | 게시물 작성 취소 |
 *
 * @param onConfirm - 확인 버튼 클릭 시 실행할 콜백 (closeModal은 자동 호출됨)
 */

type PopupModalVariant =
  | { type: 'goalDelete' }
  | { type: 'noteDelete' }
  | { type: 'noteLoad'; noteTitle: string }
  | { type: 'postCancel' }
  | { type: 'githubDisconnect' };

interface PopupModalProps {
  onConfirm: () => void;
  variant: PopupModalVariant;
}

interface ModalConfig {
  titleLines: string[];
  warning: string | null;
  confirmLabel: string;
  labelledBy: string;
}

function getConfig(variant: PopupModalVariant): ModalConfig {
  switch (variant.type) {
    case 'goalDelete':
      return {
        titleLines: ['목표를 삭제하시겠어요?'],
        warning: '삭제된 목표는 복구할 수 없습니다.',
        confirmLabel: '확인',
        labelledBy: 'confirm-modal-goal-delete',
      };
    case 'noteDelete':
      return {
        titleLines: ['노트를 삭제하시겠어요?'],
        warning: '삭제된 노트는 복구할 수 없습니다.',
        confirmLabel: '확인',
        labelledBy: 'confirm-modal-note-delete',
      };
    case 'noteLoad':
      return {
        titleLines: [`'${variant.noteTitle}'`, '제목의 노트를 불러오시겠어요?'],
        warning: null,
        confirmLabel: '불러오기',
        labelledBy: 'confirm-modal-note-load',
      };
    case 'postCancel':
      return {
        titleLines: ['게시물 작성을 취소하시겠어요?'],
        warning: '작성하신 모든 내용이 사라집니다.',
        confirmLabel: '확인',
        labelledBy: 'confirm-modal-post-cancel',
      };
    case 'githubDisconnect':
      return {
        titleLines: ['GitHub 저장소 연결을 해제하시겠어요?'],
        warning: '연결된 이슈·PR 할 일의 GitHub 동기화가 중단됩니다.',
        confirmLabel: '해제',
        labelledBy: 'confirm-modal-github-disconnect',
      };
  }
}

export function PopupModal({ onConfirm, variant }: PopupModalProps) {
  const { closeModal } = useModalStore();
  const { titleLines, warning, confirmLabel, labelledBy } = getConfig(variant);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="w-85.75 rounded-3xl bg-white p-4 pt-12 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] md:w-114 md:rounded-[40px] md:p-8 md:pt-16"
    >
      {/* 타이틀 + 경고 */}
      <div className="mb-8 flex flex-col text-center md:mb-10">
        <p id={labelledBy} className="text-sm font-semibold text-slate-800 md:text-xl">
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
        {warning && (
          <div className="flex items-center justify-center gap-1">
            <OctagonAlert className="text-bearlog-500" size={15} />
            <span className="text-bearlog-600 text-xs leading-6 font-medium md:text-base">{warning}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="cancel"
          className="flex-1 bg-[#F2F2F2] px-[18px] py-[10px] text-sm text-gray-500 md:py-[14px] md:text-[18px]"
          onClick={closeModal}
        >
          취소
        </Button>
        <Button
          variant="primary"
          className="flex-1 px-[18px] py-[10px] text-sm md:py-[14px] md:text-[18px]"
          onClick={() => {
            onConfirm();
            closeModal();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
