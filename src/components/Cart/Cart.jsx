/* eslint-disable */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { removeItem, updateQuantity } from "@/store/slices/cartSlice";

export default function CartSidebar({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const cartItems = useSelector((state) => state?.cart?.cartItems || []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.Product_price * item.quantity,
    0
  );

  const handleQuantityChange = (id, currentQty, action) => {
    const newQty = action === "inc" ? currentQty + 1 : currentQty - 1;
    if (newQty >= 1) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={setOpen}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white dark:bg-gray-950 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-5">
                      <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Shopping Cart
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      {cartItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                          <div className="mb-6 rounded-full bg-gray-100 dark:bg-gray-800 p-6">
                            <svg
                              className="h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            Your cart is empty
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-8">
                            Looks like you haven't added anything yet.
                          </p>
                          <button
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-teal-600 px-8 py-3 text-white font-medium hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
                          >
                            Start Shopping
                          </button>
                        </div>
                      ) : (
                        <ul className="space-y-6">
                          {cartItems.map((item) => (
                            <li
                              key={item.Product_ID}
                              className="flex space-x-4 py-4"
                            >
                              {/* Product Image */}
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                <img
                                  src={item.Product_image || item.image || "/placeholder-product.jpg"}
                                  alt={item.Product_name || "Product"}
                                  className="h-full w-full object-cover object-center"
                                  onError={(e) => {
                                    e.target.src = "/placeholder-product.jpg";
                                  }}
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex flex-1 flex-col">
                                <div className="flex justify-between">
                                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                    {item.Product_name || "Product"}
                                  </h3>
                                  <p className="ml-4 text-base font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    ${(item.Product_price * item.quantity).toFixed(2)}
                                  </p>
                                </div>

                                {item.color && (
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {item.color}
                                  </p>
                                )}

                                <div className="mt-4 flex items-center justify-between">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(item.Product_ID, item.quantity, "dec")
                                      }
                                      disabled={item.quantity <= 1}
                                      className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      -
                                    </button>
                                    <span className="w-10 text-center font-medium text-gray-900 dark:text-white">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(item.Product_ID, item.quantity, "inc")
                                      }
                                      className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                    >
                                      +
                                    </button>
                                  </div>

                                  {/* Remove Button */}
                                  <button
                                    onClick={() => handleRemoveItem(item.Product_ID)}
                                    className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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
                      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-6 py-6">
                        <div className="flex justify-between text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          <span>Subtotal</span>
                          <span>
                            ${subtotal.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          Shipping and taxes will be calculated at checkout.
                        </p>

                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => { setOpen(false); router.push('/CheckoutPage'); }}
                            className="w-full rounded-xl bg-[#088395] px-6 py-4 text-white font-semibold shadow-lg hover:bg-[#066a78] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#088395] focus:ring-offset-2 transition-all duration-200"
                          >
                            Proceed to Checkout
                          </button>
                          <button
                            onClick={() => { setOpen(false); router.push('/CartPage'); }}
                            className="w-full rounded-xl border-2 border-[#088395] text-[#088395] dark:border-[#088395] dark:text-[#7AB2B2] px-6 py-3.5 font-semibold hover:bg-[#088395]/5 transition-colors"
                          >
                            View Full Cart
                          </button>
                        </div>

                        <div className="mt-6 text-center">
                          <button
                            onClick={() => setOpen(false)}
                            className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors"
                          >
                            ← Continue Shopping
                          </button>
                        </div>
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
