// Wishlist API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "./endpoints";
import { cartKeys } from "./cart";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const wishlistKeys = {
  list: ["wishlist"],
};

export const useWishlist = (options = {}) =>
  useQuery({
    queryKey: wishlistKeys.list,
    queryFn: async () => unwrap(await wishlistService.getWishlist()),
    ...options,
  });

export const useAddToWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => wishlistService.addToWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: wishlistKeys.list }),
  });
};

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => wishlistService.removeFromWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: wishlistKeys.list }),
  });
};

export const useMoveWishlistToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => wishlistService.moveToCart(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: wishlistKeys.list });
      qc.invalidateQueries({ queryKey: cartKeys.detail });
    },
  });
};
