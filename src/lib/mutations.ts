import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGoals, PostGoalRequest } from './api/fetchGoals';
import { fetchTodos, PatchTodoRequest, PostTodoRequest } from './api/fetchTodos';
import { fetchUsers, PatchCurrentUserRequest, PatchCurrentUserPasswordRequest } from './api/fetchUsers';
import { useToastStore } from '@/shared/stores/useToastStore';

// goal
export const usePostGoal = () => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostGoalRequest) => {
      if (!data) {
        throw new Error('PostGoalRequest data is required');
      }

      return fetchGoals.postGoal(data);
    },
    onSuccess: () => {
      showToast('목표가 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['goals', 'list'] });
    },
  });
};

// todo
export const usePostTodo = () => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostTodoRequest) => {
      if (!data) {
        throw new Error('PostTodoRequest data is required');
      }
      return fetchTodos.postTodo(data);
    },
    onSuccess: () => {
      showToast('할 일이 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'detail'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'progress'] });
    },
    onError: () => {
      showToast('할 일 생성에 실패했습니다.', 'fail');
    },
  });
};

export const useDeleteTodo = (todoId?: number) => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (todoId === undefined) {
        throw new Error('Todo id is required');
      }
      return fetchTodos.deleteTodo(todoId);
    },
    onSuccess: () => {
      showToast('할 일이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['todos', 'list', {}] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'detail'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'progress'] });
    },
    onError: () => {
      showToast('할 일 삭제에 실패했습니다.', 'fail');
    },
  });
};

export const usePatchTodo = (todoId?: number) => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatchTodoRequest) => {
      if (todoId === undefined) {
        throw new Error('Todo id is required');
      }
      return fetchTodos.patchTodo(todoId, data);
    },

    onSuccess: () => {
      showToast('할 일이 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['todos', 'detail', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'list', {}] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'list', {}] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'detail'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'progress'] });
    },
    onError: () => {
      showToast('할 일 수정에 실패했습니다.', 'fail');
    },
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
      showToast('즐겨찾기 설정이 변경되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['todos', 'list', {}] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'detail', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'list', {}] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'detail'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'progress'] });
    },
    onError: () => {
      showToast('즐겨찾기 설정에 실패했습니다.', 'fail');
    },
  });
};

// users
export const usePatchCurrentUser = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  return useMutation({
    mutationFn: (data: PatchCurrentUserRequest) => fetchUsers.patchCurrentUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    onError: () => {
      showToast('정보 수정에 실패했습니다.', 'fail');
    },
  });
};

export const usePatchCurrentUserPassword = () => {
  const { showToast } = useToastStore();
  return useMutation({
    mutationFn: (data: PatchCurrentUserPasswordRequest) => fetchUsers.patchCurrentUserPassword(data),
    onError: () => {
      showToast('비밀번호 변경에 실패했습니다.', 'fail');
    },
  });
};
