import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGoals } from './api/fetchGoals';
import { PostGoalRequest } from './api/fetchGoals';
import { fetchTodos } from './api/fetchTodos';
import { useToastStore } from '@/shared/stores/useToastStore';

export const usePostGoal = () => {
  return useMutation({
    mutationFn: (data: PostGoalRequest) => fetchGoals.postGoal(data),
  });
};

export const usePatchTodoFavorite = (todoId?: number) => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (todoId === undefined) {
        throw new Error('Todo id is required');
      }

      return fetchTodos.patchTodoFavorite(todoId);
    },
    onSuccess: () => {
      if (todoId === undefined) return;
      queryClient.invalidateQueries({ queryKey: ['todos', 'detail', todoId] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
    },
    onError: () => {
      showToast('Error updating favorite status');
    },
  });
};
