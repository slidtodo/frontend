import type { operations } from '@/shared/types/api/schemas/api.types';
import { apiRequest } from './utils';

export type TagsResponse = operations['getList_3']['responses'][200]['content']['application/json'];

export const getTags = () => apiRequest<TagsResponse>('/api/v1/tags');
