import { queryOptions } from '@tanstack/react-query';
import { fetchGoal, fetchGoals } from './api/goals';
import { fetchTodo, fetchTodos } from './api/todos';
import { fetchNote, fetchNotes } from './api/notes';

// ────────────────────────────────────────────────────────────
// Goal 쿼리
// ────────────────────────────────────────────────────────────

export const goalQueries = {
  /**
   * 목표 목록 조회
   * @example useQuery(goalQueries.list())
   */
  list: () =>
    queryOptions({
      queryKey: ['goals', 'list'],
      queryFn: fetchGoals,
    }),

  /**
   * 목표 상세 조회
   * @example useQuery(goalQueries.detail(goalId))
   */
  detail: (goalId: number) =>
    queryOptions({
      queryKey: ['goals', 'detail', goalId],
      queryFn: () => fetchGoal(goalId),
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
  list: (params?: { goalId?: number; done?: boolean }) =>
    queryOptions({
      queryKey: ['todos', 'list', params ?? {}],
      queryFn: () => fetchTodos(params),
    }),

  /**
   * 할일 상세 조회
   * @example useQuery(todoQueries.detail(todoId))
   */
  detail: (todoId: number) =>
    queryOptions({
      queryKey: ['todos', 'detail', todoId],
      queryFn: () => fetchTodo(todoId),
    }),
};

// ────────────────────────────────────────────────────────────
// Note 쿼리
// ────────────────────────────────────────────────────────────

export const noteQueries = {
  /**
   * 노트 목록 조회
   * @example useQuery(noteQueries.list())
   * @example useQuery(noteQueries.list({ sort: 'latest' }))
   */
  list: (params?: { sort?: 'latest' | 'oldest'; search?: string }) =>
    queryOptions({
      queryKey: ['notes', 'list', params ?? {}],
      queryFn: () => fetchNotes(params),
    }),

  /**
   * 노트 상세 조회
   * @example useQuery(noteQueries.detail(noteId))
   */
  detail: (noteId: number) =>
    queryOptions({
      queryKey: ['notes', 'detail', noteId],
      queryFn: () => fetchNote(noteId),
    }),
};
