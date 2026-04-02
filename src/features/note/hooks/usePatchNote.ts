import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNotes, PatchNoteRequest } from '@/shared/lib/api/fetchNotes';
import { noteQueries } from '@/shared/lib/queryKeys';

export const usePatchNote = (noteId: number, goalId: number, callbacks?: { onError?: (error: Error) => void }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PatchNoteRequest) => fetchNotes.patchNote(noteId, body),
    onSuccess: (response) => {
      queryClient.setQueryData(noteQueries.detail(noteId).queryKey, response);
      queryClient.invalidateQueries({ queryKey: noteQueries.lists() });
      router.push(`/goal/${goalId}/note/${noteId}`);
    },
    onError: (error) => callbacks?.onError?.(error),
  });
};
