export const TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_KEY = 'user';

export const normalizeUser = (user = {}) => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const fullName =
    [firstName, lastName].filter(Boolean).join(' ') ||
    user.fullName ||
    user.name ||
    '';

  return {
    ...user,
    id: user.id ?? user._id,
    _id: user.id ?? user._id,
    firstName,
    lastName,
    fullName,
    name: fullName,
    email: user.email,
    role: user.role,
  };
};

export const getDisplayName = (user) => {
  if (!user) return '';
  return (
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.name ||
    user.email ||
    ''
  );
};

export const parseAuthSession = (response) => {
  const data = response?.data?.data ?? response?.data;
  if (!data?.accessToken) return null;

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
    user: data.user ? normalizeUser(data.user) : null,
  };
};

export const auth = {
  isAuthenticated: () => typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY),
  getToken: () => typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
  getRefreshToken: () => typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  getUser: () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return normalizeUser(JSON.parse(stored));
    } catch {
      return null;
    }
  },

  login: (accessToken, refreshToken, user) => {
    if (typeof window !== 'undefined') {
      if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)));
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  updateAccessToken: (accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, accessToken);
    }
  },
};
