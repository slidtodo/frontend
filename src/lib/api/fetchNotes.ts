import type { operations } from '@/shared/types/api/schemas/api.types';
import { serverApiRequest } from './server-utils';
import { apiRequest } from './utils';

export type GetNotesParams = operations['getList_1']['parameters']['query'];
export type NoteListResponse = operations['getList_1']['responses'][200]['content']['application/json'];
export type NoteResponse = operations['getDetail_1']['responses'][200]['content']['application/json'];
export type PostNoteRequest = operations['create_1']['requestBody']['content']['application/json'];
export type PatchNoteRequest = operations['update_1']['requestBody']['content']['application/json'];

export const getNotes = (params?: GetNotesParams) =>
  apiRequest<NoteListResponse>('/api/v1/notes', { params });
export const getNotesServer = (params?: GetNotesParams) =>
  serverApiRequest<NoteListResponse>('/api/v1/notes', { params });

export const getNote = (noteId: number) => apiRequest<NoteResponse>(`/api/v1/notes/${noteId}`);
export const getNoteServer = (noteId: number) =>
  serverApiRequest<NoteResponse>(`/api/v1/notes/${noteId}`);

export const postNote = (body: PostNoteRequest) =>
  apiRequest<NoteResponse, PostNoteRequest>('/api/v1/notes', {
    method: 'POST',
    body,
  });

export const patchNote = (noteId: number, body: PatchNoteRequest) =>
  apiRequest<NoteResponse, PatchNoteRequest>(`/api/v1/notes/${noteId}`, {
    method: 'PATCH',
    body,
  });

export const deleteNote = (noteId: number) =>
  apiRequest<void>(`/api/v1/notes/${noteId}`, {
    method: 'DELETE',
  });
