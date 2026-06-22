'use client';

import { Heart, Plus, Minus, ShoppingBag, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity, removeItem } from "@/store/slices/cartSlice";
import { productDetailRoute } from "@/lib/routes";
import { useFavoriteActions } from "@/hooks/useFavoriteActions";
import { showToast } from "@/lib/toast";

const PLACEHOLDER =
  "https://placehold.co/400x400/f1f5f9/94a3b8?text=No+Image";

const formatPrice = (value) =>
  `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;

const ProductCard = ({ product, loading = false, variant = "grid" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isFavorite, toggleFavorite } = useFavoriteActions();

  const productId = product?._id ?? product?.id;
  const cartItems = useSelector((state) => state?.cart?.cartItems || []);
  const cartItem = cartItems.find(
    (item) => (item._id ?? item.id) === productId
  );
  const favorited = isFavorite(productId);
  const name = product?.name || product?.Product_name;
  const price = Number(product?.price ?? product?.Product_price ?? 0);
  const image = product?.Product_image || product?.image || PLACEHOLDER;
  const category = product?.category || product?.Product_type;
  const discount = Number(product?.discount ?? product?.Product_discount ?? 0);
  const rating = Number(product?.rating ?? 0);
  const inStock = product?.inStock !== false && (product?.stock ?? product?.Product_TotalStock ?? 1) > 0;
  const salePrice = discount > 0 ? price - (price * discount) / 100 : price;

  const handleProductClick = () => {
    if (loading || !productId) return;
    router.push(productDetailRoute(product));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (loading || !inStock) return;
    dispatch(
      addToCart({
        ...product,
        _id: productId,
        Product_ID: product?.Product_ID ?? productId,
        Product_price: price,
        Product_name: name,
        Product_image: image,
      })
    );
    showToast.success("Added to cart");
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleFavorite({
      ...product,
      _id: productId,
      Product_ID: product?.Product_ID ?? productId,
      Product_name: name,
      Product_price: price,
      Product_image: image,
    });
  };

  const handleQuantityChange = (e, action) => {
    e.stopPropagation();
    if (!cartItem) return;
    const qty = cartItem.quantity;
    if (action === "inc") {
      dispatch(updateQuantity({ id: productId, quantity: qty + 1 }));
    } else {
      qty > 1
        ? dispatch(updateQuantity({ id: productId, quantity: qty - 1 }))
        : dispatch(removeItem(productId));
    }
  };

  const imageClass =
    variant === "slider"
      ? "relative h-36 overflow-hidden bg-surface-2 sm:h-40 md:h-44"
      : "relative h-44 overflow-hidden bg-surface-2 sm:h-48 md:h-52";

  if (loading) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface animate-pulse">
        <div className={imageClass} />
        <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
          <div className="h-2.5 w-1/4 rounded bg-surface-2" />
          <div className="h-3.5 w-full rounded bg-surface-2" />
          <div className="h-3.5 w-2/3 rounded bg-surface-2" />
          <div className="mt-auto h-4 w-1/2 rounded bg-surface-2" />
          <div className="h-9 w-full rounded-lg bg-surface-2" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleProductClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-line bg-surface transition-all duration-200 hover:border-brand/25 hover:shadow-soft"
    >
      <div className={imageClass}>
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
        {!inStock && (
          <span className="absolute left-2 bottom-2 rounded bg-ink/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
            Out of stock
          </span>
        )}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface/95 text-body shadow-soft backdrop-blur-sm transition-colors hover:text-brand"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-3.5 w-3.5 ${favorited ? "fill-brand text-brand" : ""}`} />
        </button>
      </div>

      <div className={`flex flex-1 flex-col ${variant === "slider" ? "p-3" : "p-3.5"}`}>
        {category && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
            {category}
          </span>
        )}

        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-ink">
          {name}
        </h3>

        {rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 rounded bg-green-600 px-1 py-0.5 text-[10px] font-semibold text-white">
              {rating.toFixed(1)}
              <Star className="h-2.5 w-2.5 fill-white text-white" />
            </span>
          </div>
        )}

        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-sm font-semibold text-ink sm:text-base">{formatPrice(salePrice)}</span>
          {discount > 0 && (
            <span className="text-xs text-muted line-through">{formatPrice(price)}</span>
          )}
        </div>

        <div className={`mt-auto ${variant === "slider" ? "pt-2" : "pt-3"}`} onClick={(e) => e.stopPropagation()}>
          {cartItem ? (
            <div className="flex h-9 items-center justify-between rounded-lg border border-line bg-surface-2 px-0.5">
              <button
                type="button"
                onClick={(e) => handleQuantityChange(e, "dec")}
                className="flex h-7 w-7 items-center justify-center rounded-md text-body hover:text-brand"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-semibold text-ink">{cartItem.quantity}</span>
              <button
                type="button"
                onClick={(e) => handleQuantityChange(e, "inc")}
                className="flex h-7 w-7 items-center justify-center rounded-md text-body hover:text-brand"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary h-9 w-full text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {inStock ? "Add to cart" : "Out of stock"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
