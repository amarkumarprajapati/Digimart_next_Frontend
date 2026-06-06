'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Divider, notification } from "antd";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Ticket, 
  ArrowLeft,
  ChevronRight,
  Lock
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity as updateQuantityAction,
  removeItem as removeItemAction,
} from "@/store/slices/cartSlice";
import ProfileBreadcrumb from "@/components/Breadcrumbs/ProfileBreadcrumb";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const router = useRouter();

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantityAction({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItemAction(id));
    notification.success({
      message: "Item Removed",
      description: "The item has been removed from your cart.",
      placement: "topRight",
    });
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE20") {
      setDiscount(20);
      setIsPromoApplied(true);
      notification.success({
        message: "Promo Applied",
        description: "20% discount has been added!",
        placement: "top",
      });
    } else {
      notification.error({
        message: "Invalid Code",
        description: "This promo code does not exist.",
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.Product_price || item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : subtotal > 0 ? 150 : 0;
  const tax = subtotal * 0.18;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + shipping + tax - discountAmount;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header & Breadcrumb */}
        <div className="mb-10">
          <ProfileBreadcrumb customTrail={[
            { label: 'Home', path: '/' },
            { label: 'Shopping Cart', path: '/CartPage' },
          ]} />
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
              Shopping <span className="text-[#088395]">Cart</span>
            </h1>
            <button 
              onClick={() => router.push('/products')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#088395] transition-colors"
            >
              <ArrowLeft size={12} />
              Continue Shopping
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-12 text-center shadow-premium max-w-xl mx-auto">
            <div className="w-16 h-16 bg-teal-50 dark:bg-[#088395]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-[#088395]" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Your Cart is Empty</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 font-medium">Add some amazing products to start your shopping journey.</p>
            <button
              onClick={() => router.push('/products')}
              className="px-10 py-4 bg-[#088395] hover:bg-[#066a78] text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 text-xs"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Cart Items Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-premium overflow-hidden">
                <div className="p-5 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Product Details</span>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hidden sm:block">Quantity & Price</span>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {cartItems.map((item) => (
                    <div key={item.Product_ID} className="p-5 group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-500">
                      <div className="flex flex-col sm:flex-row gap-5 items-center">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                          <img
                            src={item.Product_image || item.image || item.Products_image}
                            alt={item.Product_name || item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                             <div className="min-w-0">
                                <p className="text-[8px] font-black uppercase tracking-widest text-[#088395] mb-0.5">{item.Product_type || 'Premium'}</p>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white truncate tracking-tight">{item.Product_name || item.name}</h3>
                             </div>
                             <button 
                               onClick={() => handleRemoveItem(item.Product_ID)}
                               className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                             >
                               <Trash2 size={18} />
                             </button>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
                            {/* Quantity Control */}
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 border border-gray-200 dark:border-gray-700">
                              <button
                                onClick={() => handleUpdateQuantity(item.Product_ID, item.quantity - 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-gray-700 text-gray-500 transition-all active:scale-90"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-12 text-center font-black text-gray-900 dark:text-white">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.Product_ID, item.quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-gray-700 text-gray-500 transition-all active:scale-90"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                               <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Total</p>
                               <p className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">₹{(item.Product_price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-premium overflow-hidden">
                <div className="p-5 bg-gray-900 text-white">
                  <h2 className="text-[8px] font-black uppercase tracking-[0.3em] mb-0.5 opacity-60">Checkout</h2>
                  <h3 className="text-lg font-black tracking-tight">Order Summary</h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <span>Shipping</span>
                    <span className="text-gray-900 dark:text-white">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <span>GST (18%)</span>
                    <span className="text-gray-900 dark:text-white">₹{tax.toLocaleString()}</span>
                  </div>
                  
                  {isPromoApplied && (
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#088395]">
                      <span>Promo Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <Divider className="my-6 border-gray-100 dark:border-gray-800" />

                  <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Total Amount</p>
                       <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">₹{total.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-[#088395]/10 flex items-center justify-center">
                       <ShieldCheck className="text-[#088395] w-6 h-6" />
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800/50">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                        <Ticket size={14} className="text-[#088395]" /> Have a promo code?
                     </p>
                     <div className="flex gap-2">
                        <input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="CODE"
                          className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[#088395] transition-all outline-none"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#088395] dark:hover:bg-[#088395] dark:hover:text-white transition-all"
                        >
                          Apply
                        </button>
                     </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => router.push('/CheckoutPage')}
                    className="w-full mt-6 py-3.5 bg-[#088395] hover:bg-[#066a78] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                  >
                    Proceed to Checkout
                    <ChevronRight size={14} />
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                     <Lock size={12} />
                     Secure 256-bit SSL encrypted
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
