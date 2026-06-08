// Order API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "./endpoints";
import { cartKeys } from "./cart";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const orderKeys = {
  all: ["orders"],
  list: ["orders", "list"],
  detail: (id) => ["orders", "detail", id],
  track: (id) => ["orders", "track", id],
  invoice: (id) => ["orders", "invoice", id],
};

export const useOrders = (options = {}) =>
  useQuery({
    queryKey: orderKeys.list,
    queryFn: async () => unwrap(await orderService.getMyOrders()),
    ...options,
  });

export const useOrder = (id, options = {}) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => unwrap(await orderService.getOrderById(id)),
    enabled: !!id,
    ...options,
  });

export const useTrackOrder = (id, options = {}) =>
  useQuery({
    queryKey: orderKeys.track(id),
    queryFn: async () => unwrap(await orderService.trackOrder(id)),
    enabled: !!id,
    ...options,
  });

export const useOrderInvoice = (id, options = {}) =>
  useQuery({
    queryKey: orderKeys.invoice(id),
    queryFn: async () => unwrap(await orderService.getOrderInvoice(id)),
    enabled: !!id,
    ...options,
  });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => orderService.createOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      qc.invalidateQueries({ queryKey: cartKeys.detail });
    },
  });
};

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => orderService.cancelOrder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.all }),
  });
};

export const useReturnOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => orderService.returnOrder(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.all }),
  });
};
