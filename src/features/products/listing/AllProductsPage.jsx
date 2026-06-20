'use client';

import { useState, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/services/api/product";
import ProductGrid from "./components/ProductGrid";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import LoadMoreTrigger from "./components/LoadMoreTrigger";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const AllProductsPage = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("newest");

  const loaderRef = useRef(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts(
      page,
      12,
      sortBy === "newest"
        ? "-created"
        : sortBy === "price-low"
        ? "Product_price"
        : "-Product_price",
      { enabled: true }
    );

  const allProducts = data || [];

  const categories = useMemo(() => {
    const cats = new Set(
      allProducts.map((p) => p.category || p.Product_type).filter(Boolean)
    );
    return ["All", ...cats];
  }, [allProducts]);

  const products = useMemo(() => {
    let list = allProducts;
    if (selectedCategory !== "All") {
      list = list.filter(
        (p) =>
          (p.category || p.Product_type || "").toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        (p.name || p.Product_name || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [allProducts, selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedCategory("All");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container-page py-8">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {selectedCategory === "All" ? "All products" : selectedCategory}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isLoading ? "Loading..." : `${products.length} results`}
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3">
          <div className="flex flex-wrap items-center gap-2">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-brand text-white"
                    : "text-body hover:bg-surface-2"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="field h-9 px-3 text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <LoadingState />
        ) : products.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <>
            <ProductGrid products={products} />
            <LoadMoreTrigger
              loaderRef={loaderRef}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              onLoadMore={() => {
                setPage((p) => p + 1);
                fetchNextPage?.();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;
