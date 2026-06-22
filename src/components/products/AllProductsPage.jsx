'use client';

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  ChevronRight,
  ChevronDown,
  Star,
  Search,
  PackageOpen,
  LayoutGrid,
  List,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { useProducts } from "@/services/api/product";
import ProductCard from "@/components/ProductCard/ProductCard";
import { addToCart } from "@/store/slices/cartSlice";
import { useFavoriteActions } from "@/hooks/useFavoriteActions";
import { productDetailRoute } from "@/lib/routes";
import { showToast } from "@/lib/toast";

const PLACEHOLDER =
  "https://placehold.co/400x400/f1f5f9/94a3b8?text=No+Image";

const SORT_OPTIONS = [
  { value: "newest", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const sortToApi = (sort) => {
  if (sort === "newest") return "-created";
  if (sort === "price-low") return "Product_price";
  if (sort === "price-high") return "-Product_price";
  if (sort === "rating") return "-rating";
  return "";
};

const formatPrice = (value) =>
  `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;

const getProductId = (p) => p._id ?? p.id;
const getName = (p) => p.name || p.Product_name || "Product";
const getPrice = (p) => Number(p.price ?? p.Product_price ?? 0);
const getImage = (p) => p.Product_image || p.image || PLACEHOLDER;
const getCategory = (p) => p.category || p.Product_type || "";
const getDiscount = (p) => Number(p.discount ?? p.Product_discount ?? 0);
const getRating = (p) => Number(p.rating ?? 0);
const getStock = (p) => p.stock ?? p.Product_TotalStock ?? 0;
const getInStock = (p) => p.inStock !== false && getStock(p) > 0;
const getTags = (p) => {
  if (Array.isArray(p.tags)) return p.tags;
  if (p.Product_tags) return p.Product_tags.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-line/80 py-3.5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-1 py-0.5 text-left text-sm font-semibold text-ink hover:text-brand"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="mt-2.5 space-y-1">{children}</div>}
    </div>
  );
};

const FilterOption = ({ children, className = "" }) => (
  <label
    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-surface-2 ${className}`}
  >
    {children}
  </label>
);

const ProductListRow = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isFavorite, toggleFavorite } = useFavoriteActions();

  const id = getProductId(product);
  const name = getName(product);
  const price = getPrice(product);
  const image = getImage(product);
  const discount = getDiscount(product);
  const rating = getRating(product);
  const inStock = getInStock(product);
  const tags = getTags(product);
  const salePrice = discount > 0 ? price - (price * discount) / 100 : price;
  const favorited = isFavorite(id);

  const handleAddToCart = () => {
    if (!inStock) return;
    dispatch(
      addToCart({
        ...product,
        _id: id,
        Product_ID: product?.Product_ID ?? id,
        Product_name: name,
        Product_price: price,
        Product_image: image,
      })
    );
    showToast.success("Added to cart");
  };

  const handleToggleWishlist = () => {
    toggleFavorite({
      ...product,
      _id: id,
      Product_ID: product?.Product_ID ?? id,
      Product_name: name,
      Product_price: price,
      Product_image: image,
    });
  };

  return (
    <article className="card overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-6 sm:p-5">
        <div className="flex shrink-0 items-start gap-3 sm:w-44">
          <button
            type="button"
            onClick={() => router.push(productDetailRoute(product))}
            className="relative aspect-square w-full max-w-[140px] overflow-hidden rounded-lg bg-surface-2 sm:max-w-none"
          >
            <img
              src={image}
              alt={name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER;
              }}
            />
            {discount > 0 && (
              <span className="absolute left-2 top-2 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {discount}% off
              </span>
            )}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => router.push(productDetailRoute(product))}
            className="text-left text-base font-medium text-brand hover:underline sm:text-lg"
          >
            {name}
          </button>

          {rating > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${
                      s <= Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-line"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted">{rating.toFixed(1)}</span>
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Key features
              </p>
              <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-sm text-body">
                {tags.slice(0, 4).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          )}

          {getCategory(product) && (
            <p className="mt-3 text-xs text-muted">
              Category: <span className="text-body">{getCategory(product)}</span>
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col justify-between border-line sm:w-52 sm:border-l sm:pl-6">
          <div>
            <p className="text-xl font-semibold text-ink">{formatPrice(salePrice)}</p>
            {discount > 0 && (
              <p className="text-sm text-muted line-through">{formatPrice(price)}</p>
            )}
            <p className={`mt-2 text-xs font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
              {inStock ? "In Stock" : "Out of Stock"}
            </p>
            {inStock && getStock(product) <= 10 && (
              <p className="mt-0.5 text-xs text-amber-600">Only {getStock(product)} left</p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary h-10 w-full text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              type="button"
              onClick={handleToggleWishlist}
              className="inline-flex w-full items-center justify-center gap-1.5 text-sm text-muted transition-colors hover:text-brand"
            >
              <Heart className={`h-4 w-4 ${favorited ? "fill-brand text-brand" : ""}`} />
              {favorited ? "Saved" : "Add to Wish List"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const ProductListSkeleton = () => (
  <div className="card animate-pulse p-5">
    <div className="flex gap-5">
      <div className="h-36 w-36 rounded-lg bg-surface-2" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-3/4 rounded bg-surface-2" />
        <div className="h-4 w-1/4 rounded bg-surface-2" />
        <div className="h-3 w-full rounded bg-surface-2" />
        <div className="h-3 w-5/6 rounded bg-surface-2" />
      </div>
      <div className="hidden w-44 space-y-3 sm:block">
        <div className="h-6 w-24 rounded bg-surface-2" />
        <div className="h-10 w-full rounded bg-surface-2" />
      </div>
    </div>
  </div>
);

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const { data: products = [], isLoading } = useProducts(1, 48, sortToApi(sortBy), {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const priceCeiling = useMemo(() => {
    const prices = products.map(getPrice);
    return Math.max(...prices, 100000);
  }, [products]);

  const categories = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = getCategory(p);
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  const brands = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      getTags(p).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [products]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    const urlCategory = searchParams.get("category");
    if (!urlCategory) {
      setCategory("All");
      return;
    }
    const match = categories.find(
      ([cat]) => cat.toLowerCase() === urlCategory.toLowerCase()
    );
    setCategory(match ? match[0] : urlCategory);
  }, [searchParams, categories]);

  useEffect(() => {
    setMaxPrice(priceCeiling);
  }, [priceCeiling]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "All") {
      list = list.filter(
        (p) => getCategory(p).toLowerCase() === category.toLowerCase()
      );
    }

    const q = (search || sidebarSearch).trim().toLowerCase();
    if (q) {
      list = list.filter((p) => getName(p).toLowerCase().includes(q));
    }

    if (selectedBrands.length > 0) {
      list = list.filter((p) =>
        getTags(p).some((tag) => selectedBrands.includes(tag))
      );
    }

    list = list.filter((p) => {
      const price = getPrice(p);
      return price >= minPrice && price <= maxPrice;
    });

    if (minRating > 0) {
      list = list.filter((p) => getRating(p) >= minRating);
    }

    if (inStockOnly) {
      list = list.filter(getInStock);
    }

    if (onSaleOnly) {
      list = list.filter((p) => getDiscount(p) > 0);
    }

    if (sortBy === "rating") {
      list.sort((a, b) => getRating(b) - getRating(a));
    }

    return list;
  }, [
    products,
    category,
    search,
    sidebarSearch,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSidebarSearch("");
    setCategory("All");
    setSelectedBrands([]);
    setSortBy("newest");
    setMinPrice(0);
    setMaxPrice(priceCeiling);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  const pageTitle = category !== "All" ? category : "All Products";
  const categoryExists =
    category === "All" ||
    categories.some(([cat]) => cat.toLowerCase() === category.toLowerCase());
  const activeFilterCount =
    (category !== "All" ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (search.trim() || sidebarSearch.trim() ? 1 : 0) +
    (maxPrice < priceCeiling || minPrice > 0 ? 1 : 0);

  return (
    <div className="bg-canvas">
      <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-brand">
            Products
          </Link>
          {category !== "All" && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="capitalize text-ink">{category}</span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)] lg:gap-6">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-soft">
              <div className="border-b border-line bg-surface-2/60 px-4 py-3.5">
                <h2 className="text-sm font-semibold text-ink">Refine results</h2>
                {activeFilterCount > 0 && (
                  <p className="mt-0.5 text-xs text-muted">
                    {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"} applied
                  </p>
                )}
              </div>

              <div className="px-4 py-2">
                <FilterSection title="Categories">
                  <FilterOption>
                    <input
                      type="radio"
                      name="category"
                      checked={category === "All"}
                      onChange={() => setCategory("All")}
                      className="accent-brand"
                    />
                    <span className="flex-1">All Products</span>
                    <span className="text-xs tabular-nums text-muted">{products.length}</span>
                  </FilterOption>
                  {categories.map(([cat, count]) => (
                    <FilterOption key={cat}>
                      <input
                        type="radio"
                        name="category"
                        checked={category.toLowerCase() === cat.toLowerCase()}
                        onChange={() => setCategory(cat)}
                        className="accent-brand"
                      />
                      <span className="flex-1">{cat}</span>
                      <span className="text-xs tabular-nums text-muted">{count}</span>
                    </FilterOption>
                  ))}
                </FilterSection>

                {brands.length > 0 && (
                  <FilterSection title="Brand">
                    <div className="max-h-44 space-y-0.5 overflow-y-auto pr-1">
                      {brands.map(([brand, count]) => (
                        <FilterOption key={brand}>
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="accent-brand"
                          />
                          <span className="flex-1 truncate capitalize">{brand}</span>
                          <span className="text-xs tabular-nums text-muted">{count}</span>
                        </FilterOption>
                      ))}
                    </div>
                  </FilterSection>
                )}

                <FilterSection title="Savings & Stock">
                  <FilterOption>
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={(e) => setOnSaleOnly(e.target.checked)}
                      className="accent-brand"
                    />
                    On sale
                  </FilterOption>
                  <FilterOption>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-brand"
                    />
                    In stock only
                  </FilterOption>
                </FilterSection>

                <FilterSection title="Customer Rating">
                  {[4, 3, 2].map((rating) => (
                    <FilterOption key={rating}>
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
                        & up
                      </span>
                    </FilterOption>
                  ))}
                  <FilterOption>
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="accent-brand"
                    />
                    Any rating
                  </FilterOption>
                </FilterSection>

                <FilterSection title="Price">
                  <div className="space-y-3 px-1">
                    <div className="flex items-center justify-between text-xs font-medium text-body">
                      <span>{formatPrice(minPrice)}</span>
                      <span>{formatPrice(maxPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={priceCeiling}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-brand"
                    />
                  </div>
                </FilterSection>

                <FilterSection title="Search Within Results" defaultOpen={false}>
                  <div className="relative px-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="search"
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      placeholder="Search in results..."
                      className="field h-9 w-full pl-9 text-sm"
                    />
                  </div>
                </FilterSection>
              </div>

              <div className="border-t border-line px-4 py-3">
                <button type="button" onClick={resetFilters} className="btn-outline h-9 w-full text-sm">
                  Reset filters
                </button>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-soft">
              <div className="border-b border-line px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold capitalize tracking-tight text-ink sm:text-3xl">
                      {pageTitle}
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                      {isLoading ? "Loading..." : `${filtered.length} Items`}
                    </p>
                  </div>

                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setCategory("All")}
                        className={`shrink-0 rounded-full border px-3.5 py-1 text-sm font-medium transition-colors ${
                          category === "All"
                            ? "border-brand bg-brand text-white"
                            : "border-line bg-surface text-body hover:border-brand/40"
                        }`}
                      >
                        All
                      </button>
                      {categories.map(([cat]) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`shrink-0 rounded-full border px-3.5 py-1 text-sm font-medium transition-colors ${
                            category.toLowerCase() === cat.toLowerCase()
                              ? "border-brand bg-brand text-white"
                              : "border-line bg-surface text-body hover:border-brand/40"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-line bg-surface-2/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="relative min-w-0 flex-1 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="field h-9 w-full bg-surface pl-9 text-sm"
                  />
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-muted">
                    Sort by
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="field h-9 min-w-[9.5rem] bg-surface px-3 text-sm text-ink"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex rounded-lg border border-line bg-surface p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                      className={`rounded-md p-2 transition-colors ${
                        viewMode === "list"
                          ? "bg-brand text-white"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                      className={`rounded-md p-2 transition-colors ${
                        viewMode === "grid"
                          ? "bg-brand text-white"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {!categoryExists && category !== "All" && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    No category named &quot;{category}&quot; was found. Showing all available products instead, or clear filters to browse everything.
                  </div>
                )}

                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <ProductListSkeleton key={i} />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface-2/30 px-6 py-12 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
                      <PackageOpen className="h-7 w-7 text-muted" />
                    </div>
                    <h2 className="text-lg font-medium text-ink">No products found</h2>
                    <p className="mt-1 max-w-sm text-sm text-muted">
                      {category !== "All" && !categoryExists
                        ? `We don't have any products in "${category}" yet.`
                        : "Try adjusting your filters or search terms."}
                    </p>
                    <button type="button" onClick={resetFilters} className="btn-primary mt-5 h-10 px-5 text-sm">
                      Clear filters
                    </button>
                  </div>
                ) : viewMode === "list" ? (
                  <div className="space-y-3">
                    {filtered.map((product) => (
                      <ProductListRow key={getProductId(product)} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((product) => (
                      <ProductCard key={getProductId(product)} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
