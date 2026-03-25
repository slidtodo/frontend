import type { operations } from '@/shared/types/api/schemas/api.types';
import { serverApiRequest } from './server-utils';
import { apiRequest } from './utils';

export type SignupRequest = operations['signup']['requestBody']['content']['application/json'];
export type LoginRequest = operations['login']['requestBody']['content']['application/json'];
export type OAuthLoginRequest = operations['googleLogin']['requestBody']['content']['application/json'];
export type AuthResponse = operations['login']['responses'][200]['content']['application/json'];
export type OAuthAuthorizeUrlResponse = operations['getGoogleAuthorizeUrl']['responses'][200]['content']['application/json'];

export const postSignup = (body: SignupRequest) =>
  apiRequest<AuthResponse, SignupRequest>('/api/v1/auth/signup', {
    method: 'POST',
    body,
  });

export const postLogin = (body: LoginRequest) =>
  apiRequest<AuthResponse, LoginRequest>('/api/v1/auth/login', {
    method: 'POST',
    body,
  });

export const postGoogleLogin = (body: OAuthLoginRequest) =>
  apiRequest<AuthResponse, OAuthLoginRequest>('/api/v1/auth/login/google', {
    method: 'POST',
    body,
  });

export const postGithubLogin = (body: OAuthLoginRequest) =>
  apiRequest<AuthResponse, OAuthLoginRequest>('/api/v1/auth/oauth/github', {
    method: 'POST',
    body,
  });

export const postRefreshAccessToken = () =>
  apiRequest<void>('/api/v1/auth/refresh', {
    method: 'POST',
  });

export const postLogout = () =>
  apiRequest<void>('/api/v1/auth/logout', {
    method: 'POST',
  });

export const getGoogleAuthorizeUrl = () =>
  apiRequest<OAuthAuthorizeUrlResponse>('/api/v1/auth/oauth/google/url');
export const getGoogleAuthorizeUrlServer = () =>
  serverApiRequest<OAuthAuthorizeUrlResponse>('/api/v1/auth/oauth/google/url');

export const getGithubAuthorizeUrl = () =>
  apiRequest<OAuthAuthorizeUrlResponse>('/api/v1/auth/oauth/github/url');
export const getGithubAuthorizeUrlServer = () =>
  serverApiRequest<OAuthAuthorizeUrlResponse>('/api/v1/auth/oauth/github/url');
