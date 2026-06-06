// Notification API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const notificationKeys = {
  all: ["notifications"],
  list: (page = 1, limit = 20, read = null) => ["notifications", "list", { page, limit, read }],
};

export const useNotifications = (page = 1, limit = 20, read = null, options = {}) =>
  useQuery({
    queryKey: notificationKeys.list(page, limit, read),
    queryFn: async () => unwrap(await notificationService.getNotifications(page, limit, read)),
    ...options,
  });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};
