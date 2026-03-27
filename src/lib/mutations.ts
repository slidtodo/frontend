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

export const usePatchTodoFavorite = (todoId: number) => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetchTodos.patchTodoFavorite(todoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'detail', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: () => {
      showToast('Error updating favorite status');
    },
  });
};
