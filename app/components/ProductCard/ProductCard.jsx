'use client';

/* eslint-disable */
import { useState } from "react";
import { Star, ShoppingCart, Heart, Eye, Plus, Minus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentProduct } from "@/store/slices/currentProductSlice";
import { addToCart, updateQuantity, removeItem } from "@/store/slices/cartSlice";
import { auth } from "@/utils/auth";
import { useAuthModal } from "@/hooks/useAuthModal";

const ProductCard = ({ product, path = "/product-details", loading = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openSignIn } = useAuthModal();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const cartItems = useSelector((state) => state?.cart?.cartItems || []);
  const productId = product?._id || product?.id || product?.Product_ID;
  const cartItem = cartItems.find((item) => 
    (item._id || item.id || item.Product_ID) === productId
  );

  const handleProductClick = () => {
    if (loading) return;
    dispatch(setCurrentProduct(product));
    router.push(`${path}/${productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (loading) return;
    if (!auth.isAuthenticated()) {
      openSignIn();
      return;
    }
    setIsAdding(true);
    
    const cartProduct = {
      ...product,
      Product_ID: product?._id || product?.id || product?.Product_ID,
      Product_price: product?.price || product?.Product_price,
      Product_name: product?.name || product?.Product_name,
      Product_image: product?.image || product?.Product_image
    };

    dispatch(addToCart(cartProduct));
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleQuantityChange = (e, action) => {
    e.stopPropagation();
    if (!cartItem) return;
    const currentQty = cartItem.quantity;
    if (action === "inc") {
      dispatch(updateQuantity({ id: productId, quantity: currentQty + 1 }));
    } else {
      currentQty > 1 ? dispatch(updateQuantity({ id: productId, quantity: currentQty - 1 })) : dispatch(removeItem(productId));
    }
  };

  if (loading) {
    return (
      <div className="premium-card rounded-3xl overflow-hidden p-3 animate-pulse">
        <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-2/3 mb-2" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-full mb-4" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-20" />
          <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
      className="group premium-card rounded-[2rem] p-3 flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 cursor-pointer"
    >
      {/* Visual Header: Image + Badges */}
      <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-50 dark:bg-slate-950 mb-4">
        <img
          src={product?.Product_image || product?.image || "https://via.placeholder.com/400x500?text=No+Image"}
          alt={product?.Product_name || product?.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.target.src = "https://via.placeholder.com/400x500?text=No+Image";
          }}
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-start z-10">
          {product?.discount > 0 ? (
            <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
              -{product.discount}%
            </div>
          ) : (
            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-white text-[9px] font-bold uppercase tracking-wider">New</span>
            </div>
          )}
          
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite ? 'bg-red-500 text-white' : 'glass text-white hover:bg-white hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover Action Overlay */}
        <div className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 flex items-center justify-center gap-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-1 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
            {product?.category || 'Premium'}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold">{product?.rating || '4.8'}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
          {product?.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-950 dark:text-white">
              ${product?.price?.toFixed(2)}
            </span>
            {product?.discount > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ${(product.price * (1 + product.discount/100)).toFixed(2)}
              </span>
            )}
          </div>

          {/* Cart Control */}
          <div onClick={(e) => e.stopPropagation()}>
            {cartItem ? (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={(e) => handleQuantityChange(e, "dec")}
                  className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center hover:shadow-md transition-all active:scale-90"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 text-xs font-bold">{cartItem.quantity}</span>
                <button 
                  onClick={(e) => handleQuantityChange(e, "inc")}
                  className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center hover:shadow-md transition-all active:scale-90"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-10 h-10 rounded-2xl bg-slate-950 dark:bg-white dark:text-slate-950 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-50"
              >
                {isAdding ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
