import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchAuth } from '../api';
import { fetchGoals, GoalListResponse, PatchGoalResponse, PostGoalRequest } from '../api/fetchGoals';
import { fetchNotes, PatchNoteRequest } from '../api/fetchNotes';
import {
  fetchTodos,
  PatchTodoFavoriteResponse,
  PatchTodoRequest,
  PatchTodoResponse,
  PostTodoRequest,
  TodoListResponse,
} from '../api/fetchTodos';
import { fetchUsers, PatchCurrentUserPasswordRequest, PatchCurrentUserRequest } from '../api/fetchUsers';
import { goalKeys, noteKeys, todoKeys, userKeys } from './keyFactory';
import { noteQueries } from './queryKeys';
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
    onMutate: async (data: PostGoalRequest) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.lists() });
      const previousGoals = queryClient.getQueryData(goalKeys.list());

      queryClient.setQueryData(goalKeys.list(), (old: GoalListResponse | undefined) => ({
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
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
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
      if (goalId === undefined) {
        throw new Error('Goal id is required');
      }

      await queryClient.cancelQueries({ queryKey: goalKeys.detail(goalId) });
      const previousGoal = queryClient.getQueryData(goalKeys.detail(goalId));
      queryClient.setQueryData(goalKeys.detail(goalId), undefined);

      return { previousGoal };
    },
    onSuccess: () => {
      showToast('목표가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
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
      if (goalId === undefined) {
        throw new Error('Goal id is required');
      }

      await queryClient.cancelQueries({ queryKey: goalKeys.detail(goalId) });
      const previousGoal = queryClient.getQueryData(goalKeys.detail(goalId));

      queryClient.setQueryData(goalKeys.detail(goalId), (old: PatchGoalResponse | undefined) => ({
        ...old,
        title: data.title,
      }));

      return { previousGoal };
    },
    onSuccess: () => {
      showToast('목표가 수정되었습니다.');

      if (goalId !== undefined) {
        queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
      }

      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
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
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });
      const previousTodos = queryClient.getQueryData(todoKeys.list());

      queryClient.setQueryData(todoKeys.list(), (old: TodoListResponse | undefined) => ({
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
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.details() });
      queryClient.invalidateQueries({ queryKey: userKeys.progress() });
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
      if (todoId === undefined) {
        throw new Error('Todo id is required');
      }

      await queryClient.cancelQueries({ queryKey: todoKeys.detail(todoId) });
      const previousTodo = queryClient.getQueryData(todoKeys.detail(todoId));
      queryClient.setQueryData(todoKeys.detail(todoId), undefined);

      return { previousTodo };
    },
    onSuccess: () => {
      showToast('할 일이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.details() });
      queryClient.invalidateQueries({ queryKey: userKeys.progress() });
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
      if (todoId === undefined) {
        throw new Error('Todo id is required');
      }

      await queryClient.cancelQueries({ queryKey: todoKeys.detail(todoId) });
      const previousTodo = queryClient.getQueryData(todoKeys.detail(todoId));

      queryClient.setQueryData(todoKeys.detail(todoId), (old: PatchTodoResponse | undefined) => {
        if (!old) return old;

        return {
          ...old,
          ...data,
        };
      });

      return { previousTodo };
    },
    onSuccess: () => {
      if (todoId !== undefined) {
        queryClient.invalidateQueries({ queryKey: todoKeys.detail(todoId) });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.details() });
      queryClient.invalidateQueries({ queryKey: userKeys.progress() });
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
      if (todoId === undefined) {
        throw new Error('Todo id is required');
      }

      await queryClient.cancelQueries({ queryKey: todoKeys.detail(todoId) });
      const previousTodo = queryClient.getQueryData(todoKeys.detail(todoId));

      queryClient.setQueryData(todoKeys.detail(todoId), (old: PatchTodoFavoriteResponse | undefined) => ({
        ...old,
        favorite: !old?.favorite,
      }));

      return { previousTodo };
    },
    onSuccess: () => {
      if (todoId !== undefined) {
        queryClient.invalidateQueries({ queryKey: todoKeys.detail(todoId) });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.details() });
      queryClient.invalidateQueries({ queryKey: userKeys.progress() });
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
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchNotes.postNote,
    onSuccess: (response) => {
      if (!response.id || !response.goalId) {
        console.error('[usePostNote] Unexpected API response: missing id or goalId', response);
        callbacks?.onError?.(new Error('노트 작성에 실패했습니다.'));
        return;
      }

      queryClient.setQueryData(noteQueries.detail(response.id).queryKey, response);
      queryClient.invalidateQueries({
        queryKey: noteKeys.lists(),
      });

      window.location.href = `/goal/${response.goalId}/note/${response.id}`;
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
};

export const usePatchNote = (noteId: number, goalId: number, callbacks?: { onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PatchNoteRequest) => fetchNotes.patchNote(noteId, body),
    onSuccess: (response) => {
      queryClient.setQueryData(noteQueries.detail(noteId).queryKey, response);
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
      window.location.href = `/goal/${goalId}/note/${noteId}`;
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
        queryKey: noteKeys.lists(),
      });

      router.push(`/goal/${goalId}/note`);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
};
