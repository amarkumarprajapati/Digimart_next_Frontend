export const TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

export const auth = {
  isAuthenticated: () => typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY),
  getToken: () => typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
  getRefreshToken: () => typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,

  login: (accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  updateAccessToken: (accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, accessToken);
    }
  },
}; 
