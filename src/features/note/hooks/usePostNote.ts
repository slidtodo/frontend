import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNotes } from '@/shared/lib/api/fetchNotes';
import { noteQueries } from '@/shared/lib/queryKeys';

export const usePostNote = (callbacks?: { onError: (error: Error) => void }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchNotes.postNote,
    onSuccess: (response) => {
      if (!response.id || !response.goalId) return;

      // 생성된 노트 캐시에 저장
      queryClient.setQueryData(noteQueries.detail(response.id).queryKey, response);

      // 노트 캐시 목록 무효화
      queryClient.invalidateQueries({
        queryKey: noteQueries.list().queryKey,
      });

      // 상세 페이지로 이동
      router.push(`/goal/${response.goalId}/note/${response.id}`);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
};
