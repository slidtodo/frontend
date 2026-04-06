import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchGoals, GoalListResponse, PatchGoalResponse, PostGoalRequest } from './api/fetchGoals';
import { fetchAuth } from './api';
import {
  fetchTodos,
  PatchTodoFavoriteResponse,
  PatchTodoRequest,
  PatchTodoResponse,
  PostTodoRequest,
  TodoListResponse,
} from './api/fetchTodos';
import { fetchUsers, PatchCurrentUserRequest, PatchCurrentUserPasswordRequest } from './api/fetchUsers';
import { useToastStore } from '@/shared/stores/useToastStore';

import { fetchNotes, PatchNoteRequest } from '@/shared/lib/api/fetchNotes';
import { noteQueries } from '@/shared/lib/queryKeys';

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
    onMutate: async (data: PostGoalRequest) => {
      await queryClient.cancelQueries({ queryKey: ['goals', 'list'] });
      const previousGoals = queryClient.getQueryData(['goals', 'list']);
      queryClient.setQueryData(['goals', 'list'], (old: GoalListResponse) => ({
        ...old,
        items: [
          {
            id: Math.random(),
            title: data.title,
            todos: [],
          },
          ...(old?.goals ?? []),
        ],
      }));
      return { previousGoals };
    },
    onSuccess: () => {
      showToast('목표가 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['goals', 'list'] });
    },
  });
};

export const useDeleteGoal = (goalId?: number) => {
  const router = useRouter();
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (goalId === undefined) {
        throw new Error('Goal id is required');
      }
      return fetchGoals.deleteGoal(goalId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['goals', 'detail', goalId] });
      const previousGoal = queryClient.getQueryData(['goals', 'detail', goalId]);
      queryClient.setQueryData(['goals', 'detail', goalId], undefined);
      return { previousGoal };
    },
    onSuccess: () => {
      showToast('목표가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['goals', 'list'] });
      router.push('/dashboard');
    },
    onError: () => {
      showToast('목표 삭제에 실패했습니다.', 'fail');
    },
  });
};

export const usePatchGoal = (goalId?: number) => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string }) => {
      if (goalId === undefined) {
        throw new Error('Goal id is required');
      }
      return fetchGoals.patchGoal(goalId, data);
    },
    onMutate: async (data: { title: string }) => {
      await queryClient.cancelQueries({ queryKey: ['goals', 'detail', goalId] });
      const previousGoal = queryClient.getQueryData(['goals', 'detail', goalId]);
      queryClient.setQueryData(['goals', 'detail', goalId], (old: PatchGoalResponse) => ({
        ...old,
        title: data.title,
      }));
      return { previousGoal };
    },
    onSuccess: () => {
      showToast('목표가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['goals', 'detail', goalId] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'list'] });
    },
    onError: () => {
      showToast('목표 수정에 실패했습니다.', 'fail');
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
    onMutate: async (data: PostTodoRequest) => {
      await queryClient.cancelQueries({ queryKey: ['todos', 'list'] });
      const previousTodos = queryClient.getQueryData(['todos', 'list']);
      queryClient.setQueryData(['todos', 'list'], (old: TodoListResponse) => ({
        ...old,
        items: [
          {
            id: Math.random(),
            title: data.title,
            dueDate: data.dueDate,
            tags: data.tags ?? [],
            linkUrl: data.linkUrl ?? null,
            imageUrl: data.imageUrl ?? null,
            goalId: data.goalId,
          },
          ...(old?.todos ?? []),
        ],
      }));
      return { previousTodos };
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todos', 'detail', todoId] });
      const previousTodo = queryClient.getQueryData(['todos', 'detail', todoId]);
      queryClient.setQueryData(['todos', 'detail', todoId], undefined);
      return { previousTodo };
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

    onMutate: async (data: PatchTodoRequest) => {
      await queryClient.cancelQueries({ queryKey: ['todos', 'detail', todoId] });
      const previousTodo = queryClient.getQueryData(['todos', 'detail', todoId]);
      queryClient.setQueryData(['todos', 'detail', todoId], (old: PatchTodoResponse) => {
        if (!old) return old;
        return {
          ...old,
          ...data,
        };
      });
      return { previousTodo };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'detail', todoId] });
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todos', 'detail', todoId] });
      const previousTodo = queryClient.getQueryData(['todos', 'detail', todoId]);
      queryClient.setQueryData(['todos', 'detail', todoId], (old: PatchTodoFavoriteResponse) => ({
        ...old,
        favorite: !old?.favorite,
      }));
      return { previousTodo };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'detail', todoId] });
    },
    onSettled: () => {
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

// auth
export const usePostLogout = () => {
  const router = useRouter();
  const { showToast } = useToastStore();
  return useMutation({
    mutationFn: () => fetchAuth.postLogout(),
    onSuccess: () => {
      showToast('로그아웃 되었습니다.');
      router.push('/login');
    },
    onError: () => {
      showToast('로그아웃에 실패했습니다.', 'fail');
    },
  });
};

// note
export const usePostNote = (callbacks?: { onError: (error: Error) => void }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchNotes.postNote,
    onSuccess: (response) => {
      if (!response.id || !response.goalId) return;

      queryClient.setQueryData(noteQueries.detail(response.id).queryKey, response);
      queryClient.invalidateQueries({
        queryKey: noteQueries.list().queryKey,
      });

      router.push(`/goal/${response.goalId}/note`);
      router.refresh();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
};

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

export const useDeleteNote = (noteId: number, goalId: number, callbacks?: { onError?: (error: Error) => void }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetchNotes.deleteNote(noteId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: noteQueries.detail(noteId).queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: noteQueries.lists(),
      });

      router.push(`/goal/${goalId}/note`);
      router.refresh();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
};
