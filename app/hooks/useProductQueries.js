// Re-export from the new per-domain product hooks in src/api/product.js
// so existing imports keep working.
export {
  mapProduct,
  usePopularProducts,
  useNewArrivals,
  useTrendingProducts,
} from "@/api/product";
