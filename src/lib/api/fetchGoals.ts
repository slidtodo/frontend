import type { operations } from '@/shared/types/api/schemas/api.types';
import { serverApiRequest } from './server-utils';
import { apiRequest } from './utils';

export type GetGoalsParams = operations['getList_2']['parameters']['query'];
export type GoalListResponse = operations['getList_2']['responses'][200]['content']['application/json'];
export type GoalResponse = operations['create_2']['responses'][201]['content']['application/json'];
export type GoalDetailResponse = operations['getDetail_2']['responses'][200]['content']['application/json'];
export type PostGoalRequest = operations['create_2']['requestBody']['content']['application/json'];
export type PatchGoalRequest = operations['update_2']['requestBody']['content']['application/json'];

export const getGoals = (params?: GetGoalsParams) => apiRequest<GoalListResponse>('/api/v1/goals', { params });
export const getGoalsServer = (params?: GetGoalsParams) =>
  serverApiRequest<GoalListResponse>('/api/v1/goals', { params });

export const getGoal = (goalId: number) => apiRequest<GoalDetailResponse>(`/api/v1/goals/${goalId}`);
export const getGoalServer = (goalId: number) =>
  serverApiRequest<GoalDetailResponse>(`/api/v1/goals/${goalId}`);

export const postGoal = (body: PostGoalRequest) =>
  apiRequest<GoalResponse, PostGoalRequest>('/api/v1/goals', {
    method: 'POST',
    body,
  });

export const patchGoal = (goalId: number, body: PatchGoalRequest) =>
  apiRequest<GoalResponse, PatchGoalRequest>(`/api/v1/goals/${goalId}`, {
    method: 'PATCH',
    body,
  });

export const deleteGoal = (goalId: number) =>
  apiRequest<void>(`/api/v1/goals/${goalId}`, {
    method: 'DELETE',
  });
