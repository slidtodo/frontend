import { queryOptions } from '@tanstack/react-query';

// ────────────────────────────────────────────────────────────
// 유틸
// ────────────────────────────────────────────────────────────

/** 객체를 쿼리스트링으로 변환 (undefined, null 값 제외) */
const toQueryString = (params?: Record<string, unknown>): string => {
  if (!params) return '';
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => [k, String(v)]);
  return new URLSearchParams(entries).toString();
};

// ────────────────────────────────────────────────────────────
// API fetch 함수
// ────────────────────────────────────────────────────────────

const fetchGoals = () => fetch('/api/v1/goals').then((r) => r.json());

const fetchGoal = (goalId: number) => fetch(`/api/v1/goals/${goalId}`).then((r) => r.json());

const fetchTodos = (params?: { goalId?: number; done?: boolean }) =>
  fetch(`/api/v1/todos?${toQueryString(params)}`).then((r) => r.json());

const fetchTodo = (todoId: number) => fetch(`/api/v1/todos/${todoId}`).then((r) => r.json());

const fetchNotes = (params?: { sort?: 'latest' | 'oldest'; search?: string }) =>
  fetch(`/api/v1/notes?${toQueryString(params)}`).then((r) => r.json());

const fetchNote = (noteId: number) => fetch(`/api/v1/notes/${noteId}`).then((r) => r.json());

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
      queryKey: ['todos', 'list', params],
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
      queryKey: ['notes', 'list', params],
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
