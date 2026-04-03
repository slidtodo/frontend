import { queryOptions } from '@tanstack/react-query';
import { fetchAuth } from './api/fetchAuth';
import { fetchGoals, type GetGoalsParams } from './api/fetchGoals';
import { fetchTodos, type GetTodosParams } from './api/fetchTodos';
import { fetchNotes, type GetNotesParams } from './api/fetchNotes';
import { fetchNotifications } from './api/fetchNotifications';
import { fetchTags } from './api/fetchTags';
import { fetchUsers } from './api/fetchUsers';

// ────────────────────────────────────────────────────────────
// Goal 쿼리
// ────────────────────────────────────────────────────────────

export const goalQueries = {
  /**
   * 목표 목록 조회
   * @example useQuery(goalQueries.list())
   */
  list: (params?: GetGoalsParams) =>
    queryOptions({
      queryKey: ['goals', 'list', params ?? {}],
      queryFn: () => fetchGoals.getGoals(params),
    }),

  /**
   * 목표 상세 조회
   * @example useQuery(goalQueries.detail(goalId))
   */
  detail: (goalId: number) =>
    queryOptions({
      queryKey: ['goals', 'detail', goalId],
      queryFn: () => fetchGoals.getGoal(goalId),
    }),
};

// ────────────────────────────────────────────────────────────
// Todo 쿼리
// ────────────────────────────────────────────────────────────

export const todoQueries = {
  /**
   * 할일 목록 조회
   * - goalId 넘기면 목표별 할일 목록
   * - done 넘기면 완료 여부 필터링
   * @example useQuery(todoQueries.list())
   * @example useQuery(todoQueries.list({ goalId: 1 }))
   * @example useQuery(todoQueries.list({ goalId: 1, done: true }))
   */
  list: (params: GetTodosParams) =>
    queryOptions({
      queryKey: ['todos', 'list', params ?? {}],
      queryFn: () => fetchTodos.getTodos(params),
    }),

  /**
   * 할일 상세 조회
   * @example useQuery(todoQueries.detail(todoId))
   */
  detail: (todoId: number) =>
    queryOptions({
      queryKey: ['todos', 'detail', todoId],
      queryFn: () => fetchTodos.getTodo(todoId),
    }),
};

// ────────────────────────────────────────────────────────────
// Note 쿼리
// ────────────────────────────────────────────────────────────

export const noteQueries = {
  /** 노트 전체 캐시 무효화용 상위 키 */
  all: () => ['notes'] as const,

  /** 노트 목록 전체 무효화용 키 (파라미터 무관) */
  lists: () => ['notes', 'list'] as const,

  /**
   * 노트 목록 조회
   * @example useQuery(noteQueries.list())
   * @example useQuery(noteQueries.list({ sort: 'LATEST' }))
   */
  list: (params?: GetNotesParams) =>
    queryOptions({
      queryKey: ['notes', 'list', params ?? {}],
      queryFn: () => fetchNotes.getNotes(params),
    }),

  /**
   * 노트 상세 조회
   * @example useQuery(noteQueries.detail(noteId))
   */
  detail: (noteId: number) =>
    queryOptions({
      queryKey: ['notes', 'detail', noteId],
      queryFn: () => fetchNotes.getNote(noteId),
    }),
};

export const authQueries = {
  googleAuthorizeUrl: () =>
    queryOptions({
      queryKey: ['auth', 'googleAuthorizeUrl'],
      queryFn: fetchAuth.getGoogleAuthorizeUrl,
    }),

  githubAuthorizeUrl: () =>
    queryOptions({
      queryKey: ['auth', 'githubAuthorizeUrl'],
      queryFn: fetchAuth.getGithubAuthorizeUrl,
    }),
};

export const userQueries = {
  current: () =>
    queryOptions({
      queryKey: ['users', 'me'],
      queryFn: fetchUsers.getCurrentUser,
    }),

  progress: () =>
    queryOptions({
      queryKey: ['users', 'me', 'progress'],
      queryFn: fetchUsers.getUserProgress,
    }),
};

export const notificationQueries = {
  list: () =>
    queryOptions({
      queryKey: ['notifications', 'list'],
      queryFn: fetchNotifications.getNotifications,
    }),
};

export const tagQueries = {
  list: () =>
    queryOptions({
      queryKey: ['tags', 'list'],
      queryFn: fetchTags.getTags,
    }),
};
