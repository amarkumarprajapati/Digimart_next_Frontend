'use client';

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  Star, Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw,
  ThumbsUp, ThumbsDown, Filter, CheckCircle,
  Sparkles, Send, Loader2,
} from "lucide-react";
import { Rate, Empty } from "antd";
import { HeartOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { setCurrentProduct } from "@/store/slices/currentProductSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { productService } from "@/services/api/endpoints";
import { useAuthModal } from "@/hooks/useAuthModal";
import { toastSuccess } from "@/lib/toast";
import { productDetailRoute } from "@/lib/routes";

// ─── Constants ────────────────────────────────────────────────────────────────
const PLACEHOLDER = "https://placehold.co/600x700/f1f5f9/94a3b8?text=No+Image";
const GEMINI_API_KEY = "AIzaSyANiNmSPWX06AhKAEJ7-6-UYnzU1eh8Fmk";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ProductDetailsSkeleton = () => (
  <div className="bg-white dark:bg-gray-950 min-h-screen animate-pulse">
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-20 rounded-lg bg-gray-200 dark:bg-gray-800" />
                ))}
              </div>
              <div className="flex-1 h-[500px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="flex flex-col space-y-6">
              <div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
              <div className="flex gap-3 pt-4">
                <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              </div>
              <div className="h-16 w-full bg-gray-100 dark:bg-gray-800/50 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 space-y-4">
            <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
          <div className="col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Product Gallery + Info ────────────────────────────────────────────────────
const ProductMain = ({ currentProduct }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { openSignIn } = useAuthModal();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);

  const {
    _id: id,
    Product_name, name: _name,
    Product_price, price: _price,
    Product_discount, discount: _discount,
    rating = 0, reviewCount = 0,
    Product_image, image: _image,
    Product_images, images: _images,
    colors = [], sizes = [],
    Product_desc, description: _description,
    Product_TotalStock, stock: _stock,
    brand, category, Product_type,
  } = currentProduct || {};

  const name = Product_name || _name;
  const price = Number(Product_price || _price || 0);
  const image = Product_image || _image || PLACEHOLDER;
  const description = Product_desc || _description;
  const stock = Product_TotalStock !== undefined ? Product_TotalStock : _stock;
  const inStock = stock === undefined || stock > 0;

  const rawImages = Product_images?.length > 0 ? Product_images : _images || [];
  const processedImages = rawImages.map((img) => (typeof img === "object" && img.url ? img.url : img));
  const productImages = processedImages.length > 0 ? processedImages : [image, image, image, image];

  const discount = Number(Product_discount || _discount || 0);
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : null;
  const sizeOptions = sizes.length > 0 ? sizes : ["XS", "S", "M", "L", "XL"];
  const colorOptions = colors.length > 0 ? colors : ["#0f172a", "#64748b", "#0d9488", "#b91c1c"];
  const categoryLabel =
    typeof category === "object" && category?.name
      ? category.name
      : category || Product_type || brand;

  const buildCartItem = () => ({
    ...currentProduct,
    _id: id,
    Product_ID: currentProduct?.Product_ID || id,
    name, price,
    Product_price: price,
    Product_name: name,
    Product_image: image,
    image, quantity,
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) { openSignIn(); return; }
    dispatch(addToCart(buildCartItem()));
    toastSuccess(`${name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { openSignIn(); return; }
    dispatch(addToCart(buildCartItem()));
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          {productImages.slice(0, 4).map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`h-16 w-16 overflow-hidden rounded-lg border transition-colors ${
                selectedImage === index ? "border-brand" : "border-line"
              }`}
            >
              <img
                src={img || image}
                alt={`${name} view ${index + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
              />
            </button>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden rounded-xl border border-line bg-surface-2">
          <img
            src={productImages[selectedImage] || image}
            alt={name}
            className="h-[460px] w-full object-cover"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
          <button
            onClick={() => setWishlisted((s) => !s)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-body shadow-soft transition-colors hover:text-brand"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-5 w-5 ${wishlisted ? "fill-brand text-brand" : ""}`} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col">
        {categoryLabel && (
          <span className="text-sm font-medium uppercase tracking-wide text-muted">
            {categoryLabel}
          </span>
        )}
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-ink lg:text-3xl">
          {name}
        </h1>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-line"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted">
            {rating ? rating.toFixed(1) : "0.0"}
            {reviewCount ? ` · ${reviewCount} reviews` : ""}
          </span>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-ink">${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-lg text-muted line-through">${originalPrice.toFixed(2)}</span>
          )}
          {discount > 0 && (
            <span className="rounded-md bg-brand-soft px-2 py-0.5 text-sm font-medium text-brand">
              -{discount}%
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">
          {description || "A timeless essential made from quality materials — lightweight, comfortable and endlessly versatile."}
        </p>

        <div className="mt-6">
          <span className="text-sm font-medium text-ink">Color</span>
          <div className="mt-2 flex items-center gap-2">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === index ? "border-brand" : "border-line"}`}
                style={{ backgroundColor: color }}
                aria-label={`Color ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <span className="text-sm font-medium text-ink">Size</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  selectedSize === size ? "border-brand bg-brand text-white" : "border-line text-body hover:border-brand"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <span className="text-sm font-medium text-ink">Quantity</span>
          <div className="mt-2 flex w-fit items-center rounded-lg border border-line">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center text-body hover:text-brand"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium text-ink">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center text-body hover:text-brand"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={handleAddToCart} disabled={!inStock} className="btn-primary h-12 flex-1 text-sm">
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <button onClick={handleBuyNow} disabled={!inStock} className="btn-outline h-12 flex-1 text-sm">
            Buy Now
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 border-t border-line pt-6 sm:grid-cols-3">
          {[
            { icon: Truck, label: "Free shipping over $75" },
            { icon: RotateCcw, label: "30-day returns" },
            { icon: ShieldCheck, label: "Secure checkout" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-muted">
              <item.icon className="h-4 w-4 text-brand" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
const StarRating = ({ value, size = "h-4 w-4" }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`${size} ${
          s <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-line"
        }`}
      />
    ))}
  </div>
);

const ReviewSkeleton = () => (
  <div className="card p-5 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-full bg-surface-2" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-surface-2" />
        <div className="h-3 w-24 rounded bg-surface-2" />
        <div className="mt-4 h-4 w-full rounded bg-surface-2" />
        <div className="h-4 w-5/6 rounded bg-surface-2" />
      </div>
    </div>
  </div>
);

const ReviewsSection = ({ product, reviews = [], ratingDistribution = [], averageRating = 0, totalReviews = 0 }) => {
  const [ratingFilters, setRatingFilters] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(3);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", text: "Ask me anything about this product based on customer reviews." },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const reviewsEndRef = useRef(null);
  const chatEndRef = useRef(null);

  const { rating: productRating = 0, name: productName } = product || {};
  const displayRating = averageRating || productRating;

  useEffect(() => {
    if (showAiPanel) chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [aiMessages, showAiPanel]);

  const getTotalFromDistribution = () => {
    if (ratingDistribution?.length > 0 && ratingDistribution[0]) {
      return Object.values(ratingDistribution[0]).reduce((sum, c) => sum + (c || 0), 0);
    }
    return totalReviews || reviews.length;
  };
  const calculatedTotal = getTotalFromDistribution();

  const getRatingDistributionData = () => {
    if (ratingDistribution?.length > 0 && ratingDistribution[0]) {
      const dist = ratingDistribution[0];
      return [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: dist[star] || 0,
        percent: calculatedTotal > 0 ? ((dist[star] || 0) / calculatedTotal) * 100 : 0,
      }));
    }
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star],
      percent: calculatedTotal > 0 ? (counts[star] / calculatedTotal) * 100 : 0,
    }));
  };
  const ratingDistributionData = getRatingDistributionData();
  const recommendPercent = Math.round(
    (reviews.filter((r) => r.rating >= 4).length / (calculatedTotal || 1)) * 100
  );

  const getSortedReviews = () => {
    let result = [...reviews].filter(
      (r) => ratingFilters.length === 0 || ratingFilters.includes(r.rating)
    );
    if (sortBy === "newest")
      result.sort((a, b) => new Date(b.createdAt || b.created_at || b.date) - new Date(a.createdAt || a.created_at || a.date));
    else if (sortBy === "oldest")
      result.sort((a, b) => new Date(a.createdAt || a.created_at || a.date) - new Date(b.createdAt || b.created_at || b.date));
    else if (sortBy === "highest") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "lowest") result.sort((a, b) => a.rating - b.rating);
    else if (sortBy === "helpful") result.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    return result;
  };
  const filteredReviews = getSortedReviews();
  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const toggleRatingFilter = (star) => {
    setIsFiltering(true);
    setRatingFilters((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
    setVisibleCount(3);
    setTimeout(() => setIsFiltering(false), 400);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((p) => p + 3);
      setIsLoadingMore(false);
    }, 400);
  };

  const handleAskAI = async () => {
    if (!aiQuery.trim() || isAiLoading) return;
    const userMessage = aiQuery;
    setAiMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setAiQuery("");
    setIsAiLoading(true);
    try {
      const ctx = reviews
        .slice(0, 10)
        .map(
          (r) =>
            `${r.userName || r.customerName || r.user || "Anonymous"} rated ${r.rating}/5. ${r.title}. ${r.comment || r.text}`
        )
        .join("\n");
      const prompt = `You are a shopping assistant for DigiMart. Product: ${productName || "this product"}.\nReviews:\n${ctx}\n\nUser: ${userMessage}\n\nAnswer concisely based on the reviews.`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.candidates[0].content.parts[0].text },
      ]);
    } catch (err) {
      setAiMessages((prev) => [...prev, { role: "assistant", text: `Error: ${err.message}` }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section className="py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Customer reviews</h2>
          <p className="mt-1 text-sm text-muted">
            {calculatedTotal} verified {calculatedTotal === 1 ? "review" : "reviews"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAiPanel((s) => !s)}
            className="btn-outline h-9 px-3 text-sm"
          >
            <Sparkles className="mr-2 inline h-4 w-4" />
            Review insights
          </button>
          <select
            value={sortBy}
            onChange={(e) => {
              setIsFiltering(true);
              setSortBy(e.target.value);
              setTimeout(() => setIsFiltering(false), 300);
            }}
            className="field h-9 min-w-[160px] px-3 text-sm"
          >
            <option value="newest">Most recent</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
            <option value="helpful">Most helpful</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Summary sidebar */}
        <aside className="space-y-4 lg:col-span-4">
          <div className="card p-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-semibold text-ink">{displayRating.toFixed(1)}</p>
                <StarRating value={displayRating} />
                <p className="mt-2 text-xs text-muted">{calculatedTotal} reviews</p>
              </div>
              <div className="h-16 w-px bg-line" />
              <div>
                <p className="text-2xl font-semibold text-ink">{recommendPercent}%</p>
                <p className="text-sm text-muted">would recommend</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 text-sm font-medium text-ink">Rating breakdown</h3>
            <div className="space-y-2.5">
              {ratingDistributionData.map(({ star, count, percent }) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => toggleRatingFilter(star)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 transition-colors ${
                    ratingFilters.includes(star)
                      ? "bg-brand-soft ring-1 ring-brand/30"
                      : "hover:bg-surface-2"
                  }`}
                >
                  <span className="w-8 text-sm font-medium text-body">{star}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs text-muted">{count}</span>
                </button>
              ))}
            </div>
            {ratingFilters.length > 0 && (
              <button
                type="button"
                onClick={() => setRatingFilters([])}
                className="mt-4 w-full text-sm text-brand hover:text-brand-hover"
              >
                Clear filters
              </button>
            )}
          </div>
        </aside>

        {/* Reviews list */}
        <div className="space-y-4 lg:col-span-8">
          {showAiPanel && (
            <div className="card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-medium text-ink">Review insights</h3>
              </div>
              <div className="mb-4 max-h-48 space-y-3 overflow-y-auto rounded-lg border border-line bg-surface-2 p-4">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm leading-relaxed ${
                      msg.role === "user" ? "text-ink font-medium" : "text-body"
                    }`}
                  >
                    <span className="mr-2 text-xs uppercase tracking-wide text-muted">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </span>
                    {msg.text}
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing reviews…
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                  placeholder="Ask about quality, fit, or value…"
                  className="field h-10 flex-1 px-3 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAskAI}
                  disabled={isAiLoading}
                  className="btn-primary h-10 px-4 text-sm disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {isFiltering ? (
            [...Array(3)].map((_, i) => <ReviewSkeleton key={i} />)
          ) : visibleReviews.length > 0 ? (
            <>
              {visibleReviews.map((review, index) => (
                <article key={review._id || review.id || index} className="card p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-muted">
                      {(review.userName || review.customerName || review.user || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h4 className="text-sm font-medium text-ink">
                          {review.userName || review.customerName || review.user || "Anonymous"}
                        </h4>
                        {review.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">
                            <CheckCircle className="h-3 w-3" />
                            Verified purchase
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <StarRating value={review.rating} />
                        <span className="text-xs text-muted">
                          {new Date(
                            review.createdAt || review.created_at || review.date
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {review.title && (
                        <h5 className="mt-3 text-sm font-medium text-ink">{review.title}</h5>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-body">
                        {review.comment || review.text}
                      </p>
                      <div className="mt-4 flex items-center gap-4 border-t border-line pt-4">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-brand"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Helpful
                          {review.helpful > 0 && (
                            <span className="text-body">({review.helpful})</span>
                          )}
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-body"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              <div ref={reviewsEndRef} />
            </>
          ) : (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <Filter className="mb-4 h-10 w-10 text-muted/40" />
              <p className="text-sm font-medium text-ink">No reviews match your filters</p>
              <p className="mt-1 text-sm text-muted">Try clearing filters to see all reviews.</p>
            </div>
          )}

          {isLoadingMore && <ReviewSkeleton />}

          {visibleCount < filteredReviews.length && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="btn-outline h-10 px-6 text-sm disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </span>
                ) : (
                  "Load more reviews"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Related / Popular This Week ──────────────────────────────────────────────
const PopularThisWeek = ({ products = [], maxProducts = 10 }) => {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const scroll = (direction) => {
    scrollContainerRef.current?.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const displayProducts = products.slice(0, maxProducts);
  const hasMoreProducts = displayProducts.length > 5;

  if (products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular this week</h2>
        {hasMoreProducts && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!showLeftArrow}
              className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors ${!showLeftArrow ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <LeftOutlined />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!showRightArrow}
              className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors ${!showRightArrow ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              <RightOutlined />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {displayProducts.map((product) => {
          const pid = product._id ?? product.id;
          const name = product.Product_name || product.name || "Product";
          const price = product.Product_price || product.price || 0;
          const image = product.Product_image || product.image || "";
          const rating = product.rating || 0;
          const reviewCount = product.reviewCount || 0;
          return (
            <div
              key={pid}
              onClick={() => router.push(productDetailRoute(pid))}
              className="group cursor-pointer flex-shrink-0"
              style={{ width: "200px" }}
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = "https://placehold.co/300x400?text=No+Image"; }}
                />
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                >
                  <HeartOutlined className="text-gray-600" />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">{name}</h3>
                <p className="text-sm font-bold text-gray-900">${price.toFixed ? price.toFixed(2) : price}</p>
                <div className="flex items-center gap-1">
                  <Rate disabled allowHalf value={rating} style={{ fontSize: "12px" }} />
                  <span className="text-xs text-gray-500">({reviewCount})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────
const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentProduct, similarProducts, recentlyViewed } = useSelector((state) => state.currentProduct);
  const [fullApiData, setFullApiData] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService.getProductDetail(id)
      .then((response) => {
        if (response.data.success) {
          setFullApiData(response.data.data);
          dispatch(setCurrentProduct(response.data.data));
        }
      })
      .catch((err) => console.error("Error fetching product:", err))
      .finally(() => setLoading(false));
  }, [id, dispatch]);

  useEffect(() => { window.scrollTo(0, 0); }, [currentProduct]);

  if (loading) return <ProductDetailsSkeleton />;
  if (!currentProduct) return <div className="min-h-screen flex items-center justify-center text-muted">Product not found</div>;

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container-page py-8">
        <div className="card p-5 md:p-8">
          <ProductMain currentProduct={currentProduct} />
        </div>
      </div>

      <div className="container-page pb-8">
        <div className="card p-5 md:p-8">
          <ReviewsSection
            product={currentProduct}
            reviews={fullApiData?.reviews?.items || []}
            averageRating={fullApiData?.reviews?.averageRating || currentProduct?.rating || 0}
            totalReviews={fullApiData?.reviews?.count || 0}
          />
        </div>
      </div>

      <div className="container-page pb-12">
        <PopularThisWeek products={fullApiData?.similarProducts || similarProducts || recentlyViewed || []} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
