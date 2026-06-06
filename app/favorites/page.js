'use client';

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Link } from "next/navigation";
import { Heart, ShoppingCart, Trash2, ChevronLeft, ArrowRight, Sparkles } from "lucide-react";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import ProfileBreadcrumb from "@/components/Breadcrumbs/ProfileBreadcrumb";

const FavoritesPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex justify-between items-center mb-8">
          <ProfileBreadcrumb
            customTrail={[
              { label: "Home", path: "/" },
              { label: "Favorites", path: "/favorites" },
            ]}
          />
        </div>

        <div className="mb-12 relative">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-1 uppercase">
            My <span className="text-[#088395]">Favorites</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            You have <span className="text-[#088395] font-black">{favoriteItems.length}</span> items saved in your wishlist.
          </p>
          <div className="absolute top-0 right-0 opacity-10 hidden md:block">
             <Heart className="w-20 h-20 text-[#088395]" fill="currentColor" />
          </div>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-12 text-center max-w-2xl mx-auto shadow-premium">
            <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-[#088395]" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">Your Wishlist is Empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Looks like you haven&apos;t added any products to your favorites yet.
              Start exploring our catalog to find items you love!
            </p>
            <button
              onClick={() => router.push("/products")}
              className="px-8 py-3.5 bg-[#088395] hover:bg-[#066a78] text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto text-[10px]"
            >
              Browse Products
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favoriteItems.map((item) => (
              <div 
                key={item.Product_ID}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500 hover:border-[#088395]/30"
              >
                {/* Image Container */}
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 dark:bg-gray-800">
                  <img 
                    src={item.Product_image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"} 
                    alt={item.Product_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => handleRemove(item.Product_ID)}
                      className="p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl text-gray-400 hover:text-red-500 transition-all shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.Product_discount && (
                    <div className="absolute top-4 left-4 bg-[#088395] text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                      -{item.Product_discount}%
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{item.Product_category || "Category"}</p>
                  <h3 className="font-black text-gray-900 dark:text-white mb-2 truncate text-base tracking-tight group-hover:text-[#088395] transition-colors">
                    {item.Product_name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-[#088395]">₹{item.Product_price?.toLocaleString()}</span>
                      {item.Product_originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{item.Product_originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] flex items-center justify-center gap-3 hover:bg-[#088395] dark:hover:bg-[#088395] dark:hover:text-white transition-all shadow-xl shadow-black/10 active:scale-95"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Section */}
        {favoriteItems.length > 0 && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-[#088395]/5 dark:bg-[#088395]/10 rounded-[3rem] border border-[#088395]/10">
            <div className="text-center">
               <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Sparkles className="w-6 h-6 text-[#088395]" />
               </div>
               <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-900 dark:text-white mb-2">Secure Payment</h4>
               <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">100% Encrypted transactions</p>
            </div>
            <div className="text-center border-x border-[#088395]/10 px-8">
               <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Heart className="w-6 h-6 text-[#088395]" />
               </div>
               <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-900 dark:text-white mb-2">Curated Items</h4>
               <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Only the best for you</p>
            </div>
            <div className="text-center">
               <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <ChevronLeft className="w-6 h-6 rotate-180 text-[#088395]" />
               </div>
               <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-900 dark:text-white mb-2">Easy Returns</h4>
               <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">30-day hassle-free policy</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
