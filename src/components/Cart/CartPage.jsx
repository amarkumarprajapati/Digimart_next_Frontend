'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Lock } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity as updateQuantityAction,
  removeItem as removeItemAction,
} from "@/store/slices/cartSlice";
import { toastSuccess, toastError } from "@/lib/toast";

const PLACEHOLDER = "https://placehold.co/200x200/f1f5f9/94a3b8?text=Item";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantityAction({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItemAction(id));
    toastSuccess("Item removed from cart");
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE20") {
      setDiscount(20);
      toastSuccess("20% discount applied");
    } else {
      toastError("Invalid promo code");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.Product_price || item.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 75 ? 0 : subtotal > 0 ? 7 : 0;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + shipping - discountAmount;

  return (
    <div className="bg-canvas py-5">
      <div className="container-page">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Your Cart
            {cartItems.length > 0 && (
              <span className="ml-2 text-base font-normal text-muted">
                ({cartItems.length})
              </span>
            )}
          </h1>
          <button
            onClick={() => router.push("/products")}
            className="flex shrink-0 items-center gap-1.5 text-sm text-muted hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="card mx-auto max-w-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
              <ShoppingBag className="h-5 w-5 text-muted" />
            </div>
            <h2 className="text-base font-semibold text-ink">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted">Add some products to start your order.</p>
            <button
              onClick={() => router.push("/products")}
              className="btn-primary mt-5 h-10 px-5 text-sm"
            >
              Explore products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-5">
            <div className="lg:col-span-8">
              <div className="card overflow-hidden">
                <div className="max-h-[min(480px,calc(100dvh-14rem))] overflow-y-auto overscroll-y-contain divide-y divide-line">
                  {cartItems.map((item) => (
                    <div key={item.Product_ID} className="flex gap-3 p-3 sm:p-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2 sm:h-[72px] sm:w-[72px]">
                        <img
                          src={item.Product_image || item.image || PLACEHOLDER}
                          alt={item.Product_name || item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER;
                          }}
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            {(item.Product_type || item.category) && (
                              <p className="text-[11px] uppercase tracking-wide text-muted">
                                {item.Product_type || item.category}
                              </p>
                            )}
                            <h3 className="text-sm font-medium leading-snug text-ink line-clamp-2">
                              {item.Product_name || item.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.Product_ID)}
                            className="shrink-0 rounded-md p-1 text-muted hover:bg-surface-2 hover:text-red-600"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-line">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.Product_ID, item.quantity - 1)
                              }
                              className="flex h-8 w-8 items-center justify-center text-body hover:text-brand"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-ink">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.Product_ID, item.quantity + 1)
                              }
                              className="flex h-8 w-8 items-center justify-center text-body hover:text-brand"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-ink sm:text-base">
                            ${((item.Product_price || item.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-20">
              <div className="card p-4 sm:p-5">
                <h2 className="text-sm font-semibold text-ink sm:text-base">Order Summary</h2>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium text-ink">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Shipping</span>
                    <span className="font-medium text-ink">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-brand">
                      <span>Discount ({discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="field h-9 flex-1 px-3 text-sm"
                  />
                  <button onClick={applyPromoCode} className="btn-outline h-9 px-3 text-sm">
                    Apply
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <span className="text-sm font-medium text-ink">Total</span>
                  <span className="text-lg font-semibold text-ink">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="btn-primary mt-3 h-10 w-full text-sm"
                >
                  Proceed to Checkout
                </button>

                <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-muted">
                  <Lock className="h-3 w-3" />
                  Secure SSL encrypted checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
