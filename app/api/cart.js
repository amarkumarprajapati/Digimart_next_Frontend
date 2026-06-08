// Cart API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const cartKeys = {
  detail: ["cart"],
};

export const useCart = (options = {}) =>
  useQuery({
    queryKey: cartKeys.detail,
    queryFn: async () => unwrap(await cartService.getCart()),
    ...options,
  });

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) => cartService.addToCart(productId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.detail }),
  });
};

export const useUpdateCartItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }) => cartService.updateCartItem(itemId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.detail }),
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId) => cartService.removeFromCart(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.detail }),
  });
};

export const useClearCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.detail }),
  });
};

export const useSyncCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items) => cartService.syncCart(items),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.detail }),
  });
};
