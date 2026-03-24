import type { operations } from '@/shared/types/api/schemas/api.types';
import { apiRequest } from './utils';

export type CurrentUserResponse = operations['getMe']['responses'][200]['content']['application/json'];
export type PatchCurrentUserRequest = operations['updateMe']['requestBody']['content']['application/json'];
export type DeleteCurrentUserRequest = NonNullable<
  operations['deleteMe']['requestBody']
>['content']['application/json'];
export type PatchCurrentUserPasswordRequest =
  operations['changePassword']['requestBody']['content']['application/json'];
export type UserProgressResponse = operations['getProgress']['responses'][200]['content']['application/json'];

export const getCurrentUser = () => apiRequest<CurrentUserResponse>('/api/v1/users/me');

export const patchCurrentUser = (body: PatchCurrentUserRequest) =>
  apiRequest<CurrentUserResponse, PatchCurrentUserRequest>('/api/v1/users/me', {
    method: 'PATCH',
    body,
  });

export const deleteCurrentUser = (body?: DeleteCurrentUserRequest) =>
  apiRequest<void, DeleteCurrentUserRequest | undefined>('/api/v1/users/me', {
    method: 'DELETE',
    body,
  });

export const patchCurrentUserPassword = (body: PatchCurrentUserPasswordRequest) =>
  apiRequest<void, PatchCurrentUserPasswordRequest>('/api/v1/users/me/password', {
    method: 'PATCH',
    body,
  });

export const getUserProgress = () => apiRequest<UserProgressResponse>('/api/v1/users/me/progress');
