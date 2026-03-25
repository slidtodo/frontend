import { queryOptions } from '@tanstack/react-query';
import {
  getGithubAuthorizeUrl,
  getGithubAuthorizeUrlServer,
  getGoogleAuthorizeUrl,
  getGoogleAuthorizeUrlServer,
} from './api/fetchAuth';
import { getGoal, getGoalServer, getGoals, getGoalsServer, type GetGoalsParams } from './api/fetchGoals';
import { getTodo, getTodoServer, getTodos, getTodosServer, type GetTodosParams } from './api/fetchTodos';
import { getNote, getNoteServer, getNotes, getNotesServer, type GetNotesParams } from './api/fetchNotes';
import { getNotifications, getNotificationsServer } from './api/fetchNotifications';
import { getTags, getTagsServer } from './api/fetchTags';
import { getCurrentUser, getCurrentUserServer, getUserProgress, getUserProgressServer } from './api/fetchUsers';

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
      queryFn: () => getGoals(params),
    }),
  listServer: (params?: GetGoalsParams) =>
    queryOptions({
      queryKey: ['goals', 'list', params ?? {}],
      queryFn: () => getGoalsServer(params),
    }),

  /**
   * 목표 상세 조회
   * @example useQuery(goalQueries.detail(goalId))
   */
  detail: (goalId: number) =>
    queryOptions({
      queryKey: ['goals', 'detail', goalId],
      queryFn: () => getGoal(goalId),
    }),
  detailServer: (goalId: number) =>
    queryOptions({
      queryKey: ['goals', 'detail', goalId],
      queryFn: () => getGoalServer(goalId),
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
      queryFn: () => getTodos(params),
    }),
  listServer: (params: GetTodosParams) =>
    queryOptions({
      queryKey: ['todos', 'list', params ?? {}],
      queryFn: () => getTodosServer(params),
    }),

  /**
   * 할일 상세 조회
   * @example useQuery(todoQueries.detail(todoId))
   */
  detail: (todoId: number) =>
    queryOptions({
      queryKey: ['todos', 'detail', todoId],
      queryFn: () => getTodo(todoId),
    }),
  detailServer: (todoId: number) =>
    queryOptions({
      queryKey: ['todos', 'detail', todoId],
      queryFn: () => getTodoServer(todoId),
    }),
};

// ────────────────────────────────────────────────────────────
// Note 쿼리
// ────────────────────────────────────────────────────────────

export const noteQueries = {
  /**
   * 노트 목록 조회
   * @example useQuery(noteQueries.list())
   * @example useQuery(noteQueries.list({ sort: 'LATEST' }))
   */
  list: (params?: GetNotesParams) =>
    queryOptions({
      queryKey: ['notes', 'list', params ?? {}],
      queryFn: () => getNotes(params),
    }),
  listServer: (params?: GetNotesParams) =>
    queryOptions({
      queryKey: ['notes', 'list', params ?? {}],
      queryFn: () => getNotesServer(params),
    }),

  /**
   * 노트 상세 조회
   * @example useQuery(noteQueries.detail(noteId))
   */
  detail: (noteId: number) =>
    queryOptions({
      queryKey: ['notes', 'detail', noteId],
      queryFn: () => getNote(noteId),
    }),
  detailServer: (noteId: number) =>
    queryOptions({
      queryKey: ['notes', 'detail', noteId],
      queryFn: () => getNoteServer(noteId),
    }),
};

export const authQueries = {
  googleAuthorizeUrl: () =>
    queryOptions({
      queryKey: ['auth', 'googleAuthorizeUrl'],
      queryFn: getGoogleAuthorizeUrl,
    }),
  googleAuthorizeUrlServer: () =>
    queryOptions({
      queryKey: ['auth', 'googleAuthorizeUrl'],
      queryFn: getGoogleAuthorizeUrlServer,
    }),

  githubAuthorizeUrl: () =>
    queryOptions({
      queryKey: ['auth', 'githubAuthorizeUrl'],
      queryFn: getGithubAuthorizeUrl,
    }),
  githubAuthorizeUrlServer: () =>
    queryOptions({
      queryKey: ['auth', 'githubAuthorizeUrl'],
      queryFn: getGithubAuthorizeUrlServer,
    }),
};

export const userQueries = {
  current: () =>
    queryOptions({
      queryKey: ['users', 'me'],
      queryFn: getCurrentUser,
    }),
  currentServer: () =>
    queryOptions({
      queryKey: ['users', 'me'],
      queryFn: getCurrentUserServer,
    }),

  progress: () =>
    queryOptions({
      queryKey: ['users', 'me', 'progress'],
      queryFn: getUserProgress,
    }),
  progressServer: () =>
    queryOptions({
      queryKey: ['users', 'me', 'progress'],
      queryFn: getUserProgressServer,
    }),
};

export const notificationQueries = {
  list: () =>
    queryOptions({
      queryKey: ['notifications', 'list'],
      queryFn: getNotifications,
    }),
  listServer: () =>
    queryOptions({
      queryKey: ['notifications', 'list'],
      queryFn: getNotificationsServer,
    }),
};

export const tagQueries = {
  list: () =>
    queryOptions({
      queryKey: ['tags', 'list'],
      queryFn: getTags,
    }),
  listServer: () =>
    queryOptions({
      queryKey: ['tags', 'list'],
      queryFn: getTagsServer,
    }),
};
