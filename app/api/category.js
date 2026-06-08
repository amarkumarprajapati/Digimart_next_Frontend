// Category API hooks (TanStack Query)
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "./endpoints";
import { mapProduct } from "./product";

const unwrap = (res) => res?.data?.data ?? res?.data;
const mapList = (list) => (Array.isArray(list) ? list.map(mapProduct) : []);

export const categoryKeys = {
  all: ["categories"],
  list: ["categories", "list"],
  products: (id, page = 1, limit = 10) => ["categories", id, "products", { page, limit }],
  trending: ["categories", "trending"],
};

export const useCategories = (options = {}) =>
  useQuery({
    queryKey: categoryKeys.list,
    queryFn: async () => unwrap(await categoryService.getAllCategories()),
    staleTime: 10 * 60 * 1000,
    ...options,
  });

export const useCategoryProducts = (id, page = 1, limit = 10, options = {}) =>
  useQuery({
    queryKey: categoryKeys.products(id, page, limit),
    queryFn: async () => {
      const data = unwrap(await categoryService.getCategoryProducts(id, page, limit));
      return Array.isArray(data) ? mapList(data) : { ...data, items: mapList(data?.items) };
    },
    enabled: !!id,
    ...options,
  });

export const useTrendingCategories = (options = {}) =>
  useQuery({
    queryKey: categoryKeys.trending,
    queryFn: async () => unwrap(await categoryService.getTrendingCategories()),
    ...options,
  });
