import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNotes } from '@/lib/api/fetchNotes';
import { noteQueries } from '@/lib/queryKeys';

export const useDeleteNote = (noteId: number, callbacks?: { onError?: (error: Error) => void }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetchNotes.deleteNote(noteId),
    onSuccess: () => {
      // 삭제된 노트 캐시 제거
      queryClient.removeQueries({
        queryKey: noteQueries.detail(noteId).queryKey,
      });

      // 노트 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: noteQueries.list().queryKey,
      });

      router.back();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
};
