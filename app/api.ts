const API_BASE_URL = 'http://localhost:8000/api/v1';

export const ENDPOINTS = {
    SIGNUP: `${API_BASE_URL}/signup/`,
    LOGIN: `${API_BASE_URL}/login/`,
    DREAMS: `${API_BASE_URL}/dreams/`,
    MY_DREAMS: `${API_BASE_URL}/dreams/my_dreams/`,

    TOKEN: `${API_BASE_URL}/token/`,
    TOKEN_REFRESH: `${API_BASE_URL}/token/refresh/`,
    TOKEN_VERIFY: `${API_BASE_URL}/token/verify/`,
  };