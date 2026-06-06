// Homepage API hooks (TanStack Query)
import { useQuery } from "@tanstack/react-query";
import { homepageService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const homepageKeys = {
  banners: ["homepage", "banners"],
  deals: ["homepage", "deals"],
  categoriesSpotlight: ["homepage", "categories-spotlight"],
};

export const useBanners = (options = {}) =>
  useQuery({
    queryKey: homepageKeys.banners,
    queryFn: async () => unwrap(await homepageService.getBanners()),
    staleTime: 10 * 60 * 1000,
    ...options,
  });

export const useDeals = (options = {}) =>
  useQuery({
    queryKey: homepageKeys.deals,
    queryFn: async () => unwrap(await homepageService.getDeals()),
    ...options,
  });

export const useCategoriesSpotlight = (options = {}) =>
  useQuery({
    queryKey: homepageKeys.categoriesSpotlight,
    queryFn: async () => unwrap(await homepageService.getCategoriesSpotlight()),
    ...options,
  });
