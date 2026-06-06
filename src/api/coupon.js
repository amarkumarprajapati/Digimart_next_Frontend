// Coupon API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "./endpoints";
import { cartKeys } from "./cart";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const couponKeys = {
  available: ["coupons", "available"],
  mine: ["coupons", "mine"],
};

export const useAvailableCoupons = (options = {}) =>
  useQuery({
    queryKey: couponKeys.available,
    queryFn: async () => unwrap(await couponService.getAvailableCoupons()),
    ...options,
  });

export const useMyCoupons = (options = {}) =>
  useQuery({
    queryKey: couponKeys.mine,
    queryFn: async () => unwrap(await couponService.getMyCoupons()),
    ...options,
  });

export const useValidateCoupon = () =>
  useMutation({
    mutationFn: ({ code, cartTotal }) => couponService.validateCoupon(code, cartTotal),
  });

export const useApplyCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code) => couponService.applyCoupon(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.detail }),
  });
};
