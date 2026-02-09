const defaultBaseUrl =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:4000'
    : 'https://skillswap-backend-j66m.onrender.com';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');
