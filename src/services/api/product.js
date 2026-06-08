// Product API hooks (TanStack Query)
import { useQuery, useMutation } from "@tanstack/react-query";
import { productService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const productKeys = {
  all: ["products"],
  list: (page = 1, limit = 10, sort = "") => ["products", "list", { page, limit, sort }],
  search: (q, limit = 10) => ["products", "search", { q, limit }],
  popular: (limit = 10) => ["products", "popular", limit],
  newArrivals: ["products", "new-arrivals"],
  trending: ["products", "trending"],
  featured: ["products", "featured"],
  byId: (id) => ["products", "id", id],
  bySlug: (slug) => ["products", "slug", slug],
  byCategory: (category, page = 1, limit = 10) => [
    "products",
    "category",
    category,
    { page, limit },
  ],
  similar: (id) => ["products", "similar", id],
  recentlyViewed: ["products", "recently-viewed"],
};

export const mapProduct = (p = {}) => ({
  ...p,
  _id: p._id,
  name: p.Product_name || p.name,
  image: p.Product_image || p.image,
  price: typeof p.Product_price !== "undefined" ? p.Product_price : p.price,
  discount: p.Product_discount || p.discount,
  tags: p.Product_tags
    ? p.Product_tags.split(",").map((t) => t.trim())
    : p.tags || [],
  rating: p.rating || 0,
  slug: p.slug || "",
  type: p.Product_type || p.type,
});

const mapList = (list) => (Array.isArray(list) ? list.map(mapProduct) : []);

export const useProducts = (page = 1, limit = 10, sort = "", options = {}) =>
  useQuery({
    queryKey: productKeys.list(page, limit, sort),
    queryFn: async () => {
      const data = unwrap(await productService.getAllProducts(page, limit, sort));
      return Array.isArray(data) ? mapList(data) : { ...data, items: mapList(data?.items) };
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useSearchProducts = (q, limit = 10, options = {}) =>
  useQuery({
    queryKey: productKeys.search(q, limit),
    queryFn: async () => mapList(unwrap(await productService.searchProducts(q, limit))),
    enabled: !!q,
    ...options,
  });

export const useProductById = (id, options = {}) =>
  useQuery({
    queryKey: productKeys.byId(id),
    queryFn: async () => mapProduct(unwrap(await productService.getProductById(id))),
    enabled: !!id,
    ...options,
  });

export const useProductBySlug = (slug, options = {}) =>
  useQuery({
    queryKey: productKeys.bySlug(slug),
    queryFn: async () => mapProduct(unwrap(await productService.getProductBySlug(slug))),
    enabled: !!slug,
    ...options,
  });

export const usePopularProducts = (limit = 10, options = {}) =>
  useQuery({
    queryKey: productKeys.popular(limit),
    queryFn: async () => mapList(unwrap(await productService.getPopularProducts(limit))),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useNewArrivals = (options = {}) =>
  useQuery({
    queryKey: productKeys.newArrivals,
    queryFn: async () => mapList(unwrap(await productService.getNewArrivals())),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useTrendingProducts = (options = {}) =>
  useQuery({
    queryKey: productKeys.trending,
    queryFn: async () => mapList(unwrap(await productService.getTrendingProducts())),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useFeaturedProducts = (options = {}) =>
  useQuery({
    queryKey: productKeys.featured,
    queryFn: async () => mapList(unwrap(await productService.getFeaturedProducts())),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useProductsByCategory = (category, page = 1, limit = 10, options = {}) =>
  useQuery({
    queryKey: productKeys.byCategory(category, page, limit),
    queryFn: async () => {
      const data = unwrap(await productService.getProductsByCategory(category, page, limit));
      return Array.isArray(data) ? mapList(data) : { ...data, items: mapList(data?.items) };
    },
    enabled: !!category,
    ...options,
  });

export const useSimilarProducts = (id, options = {}) =>
  useQuery({
    queryKey: productKeys.similar(id),
    queryFn: async () => mapList(unwrap(await productService.getSimilarProducts(id))),
    enabled: !!id,
    ...options,
  });

export const useRecentlyViewedProducts = (options = {}) =>
  useQuery({
    queryKey: productKeys.recentlyViewed,
    queryFn: async () => mapList(unwrap(await productService.getRecentlyViewedProducts())),
    ...options,
  });

export const useRecordProductView = () =>
  useMutation({ mutationFn: (id) => productService.recordProductView(id) });
