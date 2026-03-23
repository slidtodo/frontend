import { fetchJSON, toQueryString } from './utils';

export const fetchNotes = (params?: { sort?: 'latest' | 'oldest'; search?: string }) =>
  fetchJSON(`/api/v1/notes?${toQueryString(params)}`);

export const fetchNote = (noteId: number) => fetchJSON(`/api/v1/notes/${noteId}`);
