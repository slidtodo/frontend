import type { operations } from '@/shared/types/api/schemas/api.types';
import { apiRequest } from './utils';

export type GetTodosParams = operations['getList']['parameters']['query'];
export type TodoListResponse = operations['getList']['responses'][200]['content']['application/json'];
export type TodoResponse = operations['getDetail']['responses'][200]['content']['application/json'];
export type PostTodoRequest = operations['create']['requestBody']['content']['application/json'];
export type PatchTodoRequest = operations['update']['requestBody']['content']['application/json'];

export const getTodos = (params: GetTodosParams) => apiRequest<TodoListResponse>('/api/v1/todos', { params });

export const getTodo = (todoId: number) => apiRequest<TodoResponse>(`/api/v1/todos/${todoId}`);

export const postTodo = (body: PostTodoRequest) =>
  apiRequest<TodoResponse, PostTodoRequest>('/api/v1/todos', {
    method: 'POST',
    body,
  });

export const patchTodo = (todoId: number, body: PatchTodoRequest) =>
  apiRequest<TodoResponse, PatchTodoRequest>(`/api/v1/todos/${todoId}`, {
    method: 'PATCH',
    body,
  });

export const deleteTodo = (todoId: number) =>
  apiRequest<void>(`/api/v1/todos/${todoId}`, {
    method: 'DELETE',
  });

export const patchTodoFavorite = (todoId: number) =>
  apiRequest<TodoResponse>(`/api/v1/todos/${todoId}/favorite`, {
    method: 'PATCH',
  });
