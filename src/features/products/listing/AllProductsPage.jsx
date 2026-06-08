import { useState, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/services/api/product";
import ProductCard from "@/components/ProductCard/ProductCard";
import ProfileBreadcrumb from "@/components/Breadcrumbs/ProfileBreadcrumb";
import FiltersSidebar from "./components/FiltersSidebar";
import ProductGrid from "./components/ProductGrid";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import LoadMoreTrigger from "./components/LoadMoreTrigger";

const AllProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState({ label: "All Prices", min: 0, max: Infinity });
  const [selectedRating, setSelectedRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("newest");

  const loaderRef = useRef(null);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts(
    page,
    12,
    sortBy === "newest" ? "-created" : sortBy === "price-low" ? "Product_price" : "-Product_price",
    { enabled: true }
  );

  const products = data || [];

  const categories = useMemo(() => {
    if (products.length > 0) {
      return ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
    }
    return ["All"];
  }, [products]);

  const handleReset = () => {
    setSelectedCategory("All");
    setSelectedPriceRange({ label: "All Prices", min: 0, max: Infinity });
    setSelectedRating(0);
    setMinDiscount(0);
    setSearchQuery("");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Banner / Breadcrumb Area */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-3 pb-2 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <ProfileBreadcrumb />
              <div className="flex items-baseline gap-2 mt-1">
                <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Collections</h1>
                <span className="text-[9px] font-black text-[#088395] uppercase tracking-widest">{products.length}+ Items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-10">
          <FiltersSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            minDiscount={minDiscount}
            onDiscountChange={setMinDiscount}
            onReset={handleReset}
          />

          <main className="flex-1">
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
                  onLoadMore={() => setPage((p) => p + 1)}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
