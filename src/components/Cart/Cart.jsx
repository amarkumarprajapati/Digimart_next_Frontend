'use client';

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { removeItem, updateQuantity } from "@/store/slices/cartSlice";

const PLACEHOLDER = "https://placehold.co/200x200/f1f5f9/94a3b8?text=Item";

export default function CartSidebar({ open, setOpen }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state?.cart?.cartItems || []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.Product_price || item.price || 0) * item.quantity,
    0
  );

  const handleQuantityChange = (id, currentQty, action) => {
    const newQty = action === "inc" ? currentQty + 1 : currentQty - 1;
    if (newQty >= 1) dispatch(updateQuantity({ id, quantity: newQty }));
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-surface shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-line px-5 py-4">
                      <Dialog.Title className="text-base font-semibold text-ink">
                        Your Cart ({cartItems.length})
                      </Dialog.Title>
                      <button
                        onClick={() => setOpen(false)}
                        className="rounded-lg p-2 text-body hover:bg-surface-2"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto px-5 py-5">
                      {cartItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
                            <ShoppingBag className="h-6 w-6 text-muted" />
                          </div>
                          <h3 className="text-base font-semibold text-ink">
                            Your cart is empty
                          </h3>
                          <p className="mt-1 text-sm text-muted">
                            Add items to get started.
                          </p>
                          <button
                            onClick={() => setOpen(false)}
                            className="btn-primary mt-6 h-10 px-5 text-sm"
                          >
                            Start shopping
                          </button>
                        </div>
                      ) : (
                        <ul className="space-y-4">
                          {cartItems.map((item) => (
                            <li key={item.Product_ID} className="flex gap-4">
                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
                                <img
                                  src={item.Product_image || item.image || PLACEHOLDER}
                                  alt={item.Product_name || "Product"}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = PLACEHOLDER;
                                  }}
                                />
                              </div>

                              <div className="flex flex-1 flex-col">
                                <div className="flex justify-between gap-2">
                                  <h3 className="text-sm font-medium text-ink line-clamp-2">
                                    {item.Product_name || item.name || "Product"}
                                  </h3>
                                  <p className="whitespace-nowrap text-sm font-semibold text-ink">
                                    ${((item.Product_price || item.price || 0) * item.quantity).toFixed(2)}
                                  </p>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-2">
                                  <div className="flex items-center rounded-lg border border-line">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(item.Product_ID, item.quantity, "dec")
                                      }
                                      disabled={item.quantity <= 1}
                                      className="flex h-8 w-8 items-center justify-center text-body hover:text-brand disabled:opacity-40"
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium text-ink">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(item.Product_ID, item.quantity, "inc")
                                      }
                                      className="flex h-8 w-8 items-center justify-center text-body hover:text-brand"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => dispatch(removeItem(item.Product_ID))}
                                    className="text-sm text-muted hover:text-red-600"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-line px-5 py-5">
                        <div className="mb-1 flex justify-between text-sm text-muted">
                          <span>Subtotal</span>
                          <span className="font-semibold text-ink">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                        <p className="mb-4 text-xs text-muted">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push("/checkout");
                          }}
                          className="btn-primary h-11 w-full text-sm"
                        >
                          Proceed to Checkout
                        </button>
                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push("/cart");
                          }}
                          className="btn-outline mt-2 h-11 w-full text-sm"
                        >
                          View Cart
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
