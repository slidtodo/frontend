import { fetchJSON, toQueryString } from './utils';

export const fetchTodos = (params?: { goalId?: number; done?: boolean }) =>
  fetchJSON(`/api/v1/todos?${toQueryString(params)}`);

export const fetchTodo = (todoId: number) => fetchJSON(`/api/v1/todos/${todoId}`);
