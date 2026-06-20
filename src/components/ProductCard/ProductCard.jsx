'use client';

import { useState } from "react";
import { Heart, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentProduct } from "@/store/slices/currentProductSlice";
import { addToCart, updateQuantity, removeItem } from "@/store/slices/cartSlice";
import { auth } from "@/lib/auth";
import { productDetailRoute } from "@/lib/routes";
import { useAuthModal } from "@/hooks/useAuthModal";

const PLACEHOLDER =
  "https://placehold.co/400x500/f1f5f9/94a3b8?text=No+Image";

const ProductCard = ({ product, loading = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openSignIn } = useAuthModal();
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItems = useSelector((state) => state?.cart?.cartItems || []);
  const productId = product?._id ?? product?.id;
  const cartItem = cartItems.find(
    (item) => (item._id ?? item.id) === productId
  );

  const name = product?.name || product?.Product_name;
  const price = Number(product?.price ?? product?.Product_price ?? 0);
  const image = product?.Product_image || product?.image || PLACEHOLDER;
  const category = product?.category || product?.Product_type;
  const discount = Number(product?.discount || product?.Product_discount || 0);

  const handleProductClick = () => {
    if (loading || !productId) return;
    dispatch(setCurrentProduct(product));
    router.push(productDetailRoute(productId));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (loading) return;
    if (!auth.isAuthenticated()) {
      openSignIn();
      return;
    }
    dispatch(
      addToCart({
        ...product,
        _id: productId,
        Product_ID: productId,
        Product_price: price,
        Product_name: name,
        Product_image: image,
      })
    );
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

  if (loading) {
    return (
      <div className="card overflow-hidden animate-pulse">
        <div className="aspect-[4/5] bg-surface-2" />
        <div className="p-4 space-y-3">
          <div className="h-3 w-1/3 bg-surface-2 rounded" />
          <div className="h-4 w-2/3 bg-surface-2 rounded" />
          <div className="h-9 w-full bg-surface-2 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleProductClick}
      className="group card overflow-hidden flex flex-col cursor-pointer transition-shadow duration-200 hover:shadow-premium"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-0.5 text-xs font-medium text-white">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite((s) => !s);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-body shadow-soft transition-colors hover:text-brand"
          aria-label="Add to wishlist"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-brand text-brand" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {category && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            {category}
          </span>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-ink">{name}</h3>

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-ink">
            ${price.toFixed(2)}
          </span>

          <div onClick={(e) => e.stopPropagation()}>
            {cartItem ? (
              <div className="flex items-center gap-1 rounded-lg border border-line">
                <button
                  onClick={(e) => handleQuantityChange(e, "dec")}
                  className="flex h-8 w-8 items-center justify-center text-body hover:text-brand"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-medium text-ink">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={(e) => handleQuantityChange(e, "inc")}
                  className="flex h-8 w-8 items-center justify-center text-body hover:text-brand"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={handleAddToCart} className="btn-primary h-9 px-3 text-sm">
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
