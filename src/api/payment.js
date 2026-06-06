// Payment API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const paymentKeys = {
  methods: ["payment", "methods"],
};

export const usePaymentMethods = (options = {}) =>
  useQuery({
    queryKey: paymentKeys.methods,
    queryFn: async () => unwrap(await paymentService.getPaymentMethods()),
    ...options,
  });

export const useCreatePaymentIntent = () =>
  useMutation({ mutationFn: (data) => paymentService.createPaymentIntent(data) });

export const useVerifyPayment = () =>
  useMutation({ mutationFn: (data) => paymentService.verifyPayment(data) });

export const useSavePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentService.savePaymentMethod(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.methods }),
  });
};

export const useDeletePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => paymentService.deletePaymentMethod(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.methods }),
  });
};
