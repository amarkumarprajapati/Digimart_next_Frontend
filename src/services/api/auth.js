// Auth API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const authKeys = {
  me: ["auth", "me"],
};

export const useCurrentUser = (options = {}) =>
  useQuery({
    queryKey: authKeys.me,
    queryFn: async () => unwrap(await authService.getCurrentUser()),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  });
};

export const useRegister = () =>
  useMutation({ mutationFn: (data) => authService.register(data) });

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => qc.clear(),
  });
};

export const useGoogleLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idToken) => authService.googleLogin(idToken),
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  });
};

export const useForgotPassword = () =>
  useMutation({ mutationFn: (email) => authService.forgotPassword(email) });

export const useResetPassword = () =>
  useMutation({
    mutationFn: ({ token, newPassword }) => authService.resetPassword(token, newPassword),
  });

export const useRefreshToken = () =>
  useMutation({ mutationFn: (refreshToken) => authService.refreshToken(refreshToken) });
