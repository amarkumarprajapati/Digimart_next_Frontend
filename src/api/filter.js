// Filter API hooks (TanStack Query)
import { useQuery } from "@tanstack/react-query";
import { filterService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const filterKeys = {
  brands: ["filters", "brands"],
  priceRange: (category) => ["filters", "price-range", category ?? "all"],
  attributes: (category) => ["filters", "attributes", category ?? "all"],
};

export const useBrands = (options = {}) =>
  useQuery({
    queryKey: filterKeys.brands,
    queryFn: async () => unwrap(await filterService.getBrands()),
    staleTime: 10 * 60 * 1000,
    ...options,
  });

export const usePriceRange = (category, options = {}) =>
  useQuery({
    queryKey: filterKeys.priceRange(category),
    queryFn: async () => unwrap(await filterService.getPriceRange(category)),
    ...options,
  });

export const useAttributes = (category, options = {}) =>
  useQuery({
    queryKey: filterKeys.attributes(category),
    queryFn: async () => unwrap(await filterService.getAttributes(category)),
    ...options,
  });
