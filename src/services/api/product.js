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
  _id: p._id ?? p.id,
  Product_ID: p.Product_ID,
  name: p.Product_name || p.name,
  Product_name: p.Product_name || p.name,
  image: p.Product_image || p.image,
  Product_image: p.Product_image || p.image,
  price: typeof p.Product_price !== "undefined" ? p.Product_price : p.price,
  Product_price: p.Product_price ?? p.price,
  discount: p.Product_discount ?? p.discount ?? 0,
  Product_discount: p.Product_discount ?? p.discount ?? 0,
  tags: p.Product_tags
    ? p.Product_tags.split(",").map((t) => t.trim())
    : p.tags || [],
  rating: p.rating || 0,
  slug: p.slug || "",
  type: p.Product_type || p.type,
  Product_type: p.Product_type || p.type,
  category:
    typeof p.category === "object" && p.category?.name
      ? p.category.name
      : p.category || p.Product_type || "",
});

const mapList = (list) => (Array.isArray(list) ? list.map(mapProduct) : []);

const extractProductList = (data) => {
  if (Array.isArray(data)) return mapList(data);
  if (Array.isArray(data?.items)) return mapList(data.items);
  if (Array.isArray(data?.products)) return mapList(data.products);
  return [];
};

export const useProducts = (page = 1, limit = 10, sort = "", options = {}) =>
  useQuery({
    queryKey: productKeys.list(page, limit, sort),
    queryFn: async () =>
      extractProductList(unwrap(await productService.getAllProducts(page, limit, sort))),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useSearchProducts = (q, limit = 10, options = {}) =>
  useQuery({
    queryKey: productKeys.search(q, limit),
    queryFn: async () =>
      extractProductList(unwrap(await productService.searchProducts(q, limit))),
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

export const usePopularProducts = (limit = 20, options = {}) =>
  useQuery({
    queryKey: productKeys.list(1, limit, ""),
    queryFn: async () =>
      extractProductList(unwrap(await productService.getAllProducts(1, limit))),
    staleTime: 5 * 60 * 1000,
    retry: false,
    ...options,
  });

export const useNewArrivals = (options = {}) =>
  useQuery({
    queryKey: productKeys.list(1, 20, "new-arrivals"),
    queryFn: async () =>
      extractProductList(unwrap(await productService.getAllProducts(1, 20))),
    staleTime: 5 * 60 * 1000,
    retry: false,
    ...options,
  });

export const useTrendingProducts = (options = {}) =>
  useQuery({
    queryKey: productKeys.list(1, 20, "trending"),
    queryFn: async () =>
      extractProductList(unwrap(await productService.getAllProducts(1, 20))),
    staleTime: 5 * 60 * 1000,
    retry: false,
    ...options,
  });

export const useFeaturedProducts = (options = {}) =>
  useQuery({
    queryKey: productKeys.featured,
    queryFn: async () =>
      extractProductList(unwrap(await productService.getFeaturedProducts())),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useProductsByCategory = (category, page = 1, limit = 10, options = {}) =>
  useQuery({
    queryKey: productKeys.byCategory(category, page, limit),
    queryFn: async () =>
      extractProductList(
        unwrap(await productService.getProductsByCategory(category, page, limit))
      ),
    enabled: !!category,
    ...options,
  });

export const useSimilarProducts = (id, options = {}) =>
  useQuery({
    queryKey: productKeys.similar(id),
    queryFn: async () =>
      extractProductList(unwrap(await productService.getSimilarProducts(id))),
    enabled: !!id,
    ...options,
  });

export const useRecentlyViewedProducts = (options = {}) =>
  useQuery({
    queryKey: productKeys.recentlyViewed,
    queryFn: async () =>
      extractProductList(unwrap(await productService.getRecentlyViewedProducts())),
    ...options,
  });

export const useRecordProductView = () =>
  useMutation({ mutationFn: (id) => productService.recordProductView(id) });
