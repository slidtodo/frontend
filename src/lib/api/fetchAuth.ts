import type { operations } from '@/shared/types/api/schemas/api.types';
import { apiRequest } from './utils';

export type SignupRequest = operations['signup']['requestBody']['content']['application/json'];
export type LoginRequest = operations['login']['requestBody']['content']['application/json'];
export type OAuthLoginRequest = operations['googleLogin']['requestBody']['content']['application/json'];
export type AuthResponse = operations['login']['responses'][200]['content']['application/json'];
export type OAuthAuthorizeUrlResponse =
  operations['getGoogleAuthorizeUrl']['responses'][200]['content']['application/json'];

class FetchAuth {
  postSignup = (body: SignupRequest) =>
    apiRequest<AuthResponse, SignupRequest>('/api/v1/auth/signup', {
      method: 'POST',
      body,
    });

  postLogin = (body: LoginRequest) =>
    apiRequest<AuthResponse, LoginRequest>('/api/v1/auth/login', {
      method: 'POST',
      body,
    });

  postGoogleLogin = (body: OAuthLoginRequest) =>
    apiRequest<AuthResponse, OAuthLoginRequest>('/api/v1/auth/login/google', {
      method: 'POST',
      body,
    });

  postGithubLogin = (body: OAuthLoginRequest) =>
    apiRequest<AuthResponse, OAuthLoginRequest>('/api/v1/auth/oauth/github', {
      method: 'POST',
      body,
    });

  postRefreshAccessToken = () =>
    apiRequest<void>('/api/v1/auth/refresh', {
      method: 'POST',
    });

  postLogout = () =>
    apiRequest<void>('/api/v1/auth/logout', {
      method: 'POST',
    });

  getGoogleAuthorizeUrl = () => apiRequest<OAuthAuthorizeUrlResponse>('/api/v1/auth/oauth/google/url');

  getGithubAuthorizeUrl = () => apiRequest<OAuthAuthorizeUrlResponse>('/api/v1/auth/oauth/github/url');
}

const fetchAuth = new FetchAuth();
export { fetchAuth };
