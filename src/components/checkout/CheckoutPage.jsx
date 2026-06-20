'use client';

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Wallet,
  Banknote,
  Lock,
  Check,
  ChevronLeft,
  Plus,
} from "lucide-react";

const PLACEHOLDER = "https://placehold.co/200x200/f1f5f9/94a3b8?text=Item";

const CheckoutPage = () => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addresses = [
    {
      id: 1,
      label: "Home",
      name: "John Doe",
      phone: "+1 234 567 890",
      line: "123 Main Street, Apt 4B, New York, NY 10001",
      isDefault: true,
    },
    {
      id: 2,
      label: "Office",
      name: "John Doe",
      phone: "+1 234 567 890",
      line: "500 Tech Park, Floor 5, San Francisco, CA 94107",
      isDefault: false,
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || item.Product_price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 75 ? 0 : subtotal > 0 ? 7 : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="card max-w-md p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
            <Check className="h-8 w-8 text-brand" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-semibold text-ink">Order placed</h2>
          <p className="mt-2 text-sm text-muted">
            Thank you. A confirmation has been sent to your email.
          </p>
          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push("/orders")}
              className="btn-primary h-11 w-full text-sm"
            >
              View my orders
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn-outline h-11 w-full text-sm"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const paymentOptions = [
    { id: "card", label: "Card", icon: CreditCard },
    { id: "upi", label: "UPI / Wallet", icon: Wallet },
    { id: "cod", label: "Cash on Delivery", icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-canvas py-8">
      <div className="container-page">
        <button
          onClick={() => router.push("/cart")}
          className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-brand"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to cart
        </button>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-ink">Checkout</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left */}
          <div className="flex-1 space-y-6">
            {/* Address */}
            <section className="card p-6">
              <h2 className="text-base font-semibold text-ink">Delivery address</h2>
              <div className="mt-4 space-y-3">
                {addresses.map((addr, idx) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      selectedAddress === idx
                        ? "border-brand bg-brand-soft"
                        : "border-line hover:border-brand/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === idx}
                      onChange={() => setSelectedAddress(idx)}
                      className="mt-1 accent-[var(--brand)]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink">{addr.name}</span>
                        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="rounded-md bg-brand-soft px-2 py-0.5 text-xs text-brand">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted">{addr.line}</p>
                      <p className="mt-0.5 text-xs text-muted">{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover">
                <Plus className="h-4 w-4" />
                Add a new address
              </button>
            </section>

            {/* Items */}
            <section className="card p-6">
              <h2 className="text-base font-semibold text-ink">Order items</h2>
              {cartItems.length === 0 ? (
                <p className="mt-4 text-sm text-muted">
                  Your cart is empty.{" "}
                  <Link href="/products" className="text-brand hover:underline">
                    Browse products
                  </Link>
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.Product_ID || item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
                        <img
                          src={item.image || item.Product_image || PLACEHOLDER}
                          alt={item.name || item.Product_name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-ink">
                          {item.name || item.Product_name}
                        </h4>
                        <p className="text-sm text-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-ink">
                        ${((item.price || item.Product_price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="card p-6">
              <h2 className="text-base font-semibold text-ink">Payment method</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {paymentOptions.map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        active ? "border-brand bg-brand-soft" : "border-line hover:border-brand/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={active}
                        onChange={() => setPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      <Icon className={`h-5 w-5 ${active ? "text-brand" : "text-muted"}`} />
                      <span
                        className={`text-sm font-medium ${active ? "text-brand" : "text-body"}`}
                      >
                        {method.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-3">
                  <input placeholder="Card number" className="field h-11 px-4 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM / YY" className="field h-11 px-4 text-sm" />
                    <input placeholder="CVV" className="field h-11 px-4 text-sm" />
                  </div>
                  <input placeholder="Name on card" className="field h-11 px-4 text-sm" />
                </div>
              )}
              {paymentMethod === "upi" && (
                <input
                  placeholder="Enter UPI ID or wallet"
                  className="field mt-4 h-11 px-4 text-sm"
                />
              )}
            </section>
          </div>

          {/* Summary */}
          <div className="lg:w-80">
            <div className="card sticky top-24 p-6">
              <h3 className="text-base font-semibold text-ink">Order summary</h3>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">
                    Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <span className="font-medium text-ink">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="font-medium text-ink">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Estimated tax</span>
                  <span className="font-medium text-ink">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="text-sm font-medium text-ink">Total</span>
                <span className="text-xl font-semibold text-ink">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing || cartItems.length === 0}
                className="btn-primary mt-5 h-11 w-full text-sm"
              >
                {processing ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {processing ? "Processing..." : "Place order"}
              </button>

              <p className="mt-3 text-center text-xs text-muted">
                Secure 256-bit SSL encrypted payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
