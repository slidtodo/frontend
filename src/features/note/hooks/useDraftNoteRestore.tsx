'use client';

import { useState, useCallback, useEffect } from 'react';
import { DraftNote, useDraftNote } from './useDraftNote';
import { useModalStore } from '@/shared/stores/useModalStore';
import { PopupModal } from '@/shared/components/Modal/PopupModal';

interface UseDraftNoteRestoreOptions {
  onRestore: (draft: DraftNote) => void;
}

export function useDraftNoteRestore({ onRestore }: UseDraftNoteRestoreOptions) {
  const { getDraft, clearDraft } = useDraftNote();
  const { openModal, closeModal } = useModalStore();

  const [draftState, setDraftState] = useState<{
    draft: DraftNote | null;
    showToast: boolean;
    showSuccessToast: boolean;
  }>({
    draft: null,
    showToast: false,
    showSuccessToast: false,
  });

  const { draft, showToast, showSuccessToast } = draftState;

  useEffect(() => {
    const saved = getDraft();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraftState({ draft: saved, showToast: true, showSuccessToast: false });
    }
  }, [getDraft]);

  const handleCloseToast = useCallback(() => {
    setDraftState((prev) => ({ ...prev, showToast: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (!draft) return;
    onRestore(draft);
    clearDraft();
    closeModal();
    setDraftState((prev) => ({ ...prev, showSuccessToast: true }));
    setTimeout(() => {
      setDraftState((prev) => ({ ...prev, showSuccessToast: false }));
    }, 3000);
  }, [draft, onRestore, clearDraft, closeModal]);

  const handleToastLoad = useCallback(() => {
    if (!draft) return;
    setDraftState((prev) => ({ ...prev, showToast: false }));
    openModal(<PopupModal variant={{ type: 'noteLoad', noteTitle: draft.title }} onConfirm={handleConfirm} />);
  }, [draft, openModal, handleConfirm]);

  return {
    draft,
    showToast,
    showSuccessToast,
    handleCloseToast,
    handleToastLoad,
  };
}
