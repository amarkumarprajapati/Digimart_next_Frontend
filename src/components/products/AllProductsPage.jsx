'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Star, Search, PackageOpen } from "lucide-react";
import { useProducts } from "@/services/api/product";
import ProductCard from "@/components/ProductCard/ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const sortToApi = (sort) => {
  if (sort === "newest") return "-created";
  if (sort === "price-low") return "Product_price";
  if (sort === "price-high") return "-Product_price";
  return "";
};

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: products = [], isLoading } = useProducts(1, 48, sortToApi(sortBy), {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) =>
        (p.name || p.Product_name || "").toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => {
      const price = Number(p.price ?? p.Product_price ?? 0);
      return price >= minPrice && price <= maxPrice;
    });
    if (minRating > 0) {
      list = list.filter((p) => Number(p.rating || 0) >= minRating);
    }
    if (inStockOnly) {
      list = list.filter((p) => p.inStock !== false && p.stock !== 0);
    }
    return list;
  }, [products, category, search, minPrice, maxPrice, minRating, inStockOnly]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("newest");
    setMinPrice(0);
    setMaxPrice(500);
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container-page py-6">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-ink">All Products</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <div className="card sticky top-24 space-y-6 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="field h-10 w-full pl-9"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-ink">Categories</p>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="accent-brand"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-ink">Price Range</p>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>${minPrice}</span>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="flex-1 accent-brand"
                  />
                  <span>${maxPrice}</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-ink">Customer Rating</p>
                {[4, 3, 2].map((rating) => (
                  <label key={rating} className="mb-2 flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="accent-brand"
                    />
                    <span className="flex items-center gap-1">
                      {rating}
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      &amp; above
                    </span>
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    className="accent-brand"
                  />
                  Any rating
                </label>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-brand"
                />
                In stock only
              </label>

              <button type="button" onClick={resetFilters} className="btn-outline w-full">
                Reset filters
              </button>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-ink">All Products</h1>
                <p className="mt-1 text-sm text-muted">
                  {isLoading ? "Loading..." : `${filtered.length} products`}
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="field h-10 px-3 text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCard key={i} loading />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="card flex flex-col items-center py-16 text-center">
                <PackageOpen className="mb-4 h-12 w-12 text-muted" />
                <h2 className="text-lg font-medium text-ink">No products found</h2>
                <p className="mt-1 text-sm text-muted">Try adjusting your filters.</p>
                <button type="button" onClick={resetFilters} className="btn-primary mt-4">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
                {filtered.map((product) => (
                  <ProductCard key={product._id ?? product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
