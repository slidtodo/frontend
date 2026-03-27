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
    showDraftToast: boolean;
  }>({
    draft: null,
    showDraftToast: false,
  });

  const { draft, showDraftToast } = draftState;

  useEffect(() => {
    const saved = getDraft();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraftState({ draft: saved, showDraftToast: true });
    }
  }, [getDraft]);

  const handleCloseToast = useCallback(() => {
    setDraftState((prev) => ({ ...prev, showDraftToast: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (!draft) return;
    onRestore(draft);
    clearDraft();
    closeModal();
  }, [draft, onRestore, clearDraft, closeModal]);

  const handleToastLoad = useCallback(() => {
    if (!draft) return;
    setDraftState((prev) => ({ ...prev, showDraftToast: false }));
    openModal(<PopupModal variant={{ type: 'noteLoad', noteTitle: draft.title }} onConfirm={handleConfirm} />);
  }, [draft, openModal, handleConfirm]);

  return {
    draft,
    savedAt: draft?.savedAt ?? null,
    showDraftToast,
    handleCloseToast,
    handleToastLoad,
  };
}
