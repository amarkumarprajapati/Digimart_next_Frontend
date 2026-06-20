'use client';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Star, Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { addToCart } from "@/store/slices/cartSlice";
import { useAuthModal } from "@/hooks/useAuthModal";
import { toastSuccess } from "@/lib/toast";

const PLACEHOLDER = "https://placehold.co/600x700/f1f5f9/94a3b8?text=No+Image";

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
    Product_name,
    name: _name,
    Product_price,
    price: _price,
    Product_discount,
    discount: _discount,
    rating = 0,
    reviewCount = 0,
    Product_image,
    image: _image,
    Product_images,
    images: _images,
    colors = [],
    sizes = [],
    Product_desc,
    description: _description,
    Product_TotalStock,
    stock: _stock,
    brand,
    category,
    Product_type,
  } = currentProduct || {};

  const name = Product_name || _name;
  const price = Number(Product_price || _price || 0);
  const image = Product_image || _image || PLACEHOLDER;
  const description = Product_desc || _description;
  const stock = Product_TotalStock !== undefined ? Product_TotalStock : _stock;
  const inStock = stock === undefined || stock > 0;

  const rawImages =
    Product_images && Product_images.length > 0 ? Product_images : _images || [];
  const processedImages = rawImages.map((img) =>
    typeof img === "object" && img.url ? img.url : img
  );
  const productImages =
    processedImages.length > 0 ? processedImages : [image, image, image, image];

  const discount = Number(Product_discount || _discount || 0);
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : null;

  const sizeOptions = sizes.length > 0 ? sizes : ["XS", "S", "M", "L", "XL"];
  const colorOptions =
    colors.length > 0 ? colors : ["#0f172a", "#64748b", "#0d9488", "#b91c1c"];

  const buildCartItem = () => ({
    ...currentProduct,
    _id: id,
    Product_ID: currentProduct?.Product_ID || id,
    name,
    price,
    Product_price: price,
    Product_name: name,
    Product_image: image,
    image,
    quantity,
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openSignIn();
      return;
    }
    dispatch(addToCart(buildCartItem()));
    toastSuccess(`${name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      openSignIn();
      return;
    }
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
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </button>
          ))}
        </div>

        <div className="relative flex-1 overflow-hidden rounded-xl border border-line bg-surface-2">
          <img
            src={productImages[selectedImage] || image}
            alt={name}
            className="h-[460px] w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
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
        {(brand || category || Product_type) && (
          <span className="text-sm font-medium uppercase tracking-wide text-muted">
            {brand || category || Product_type}
          </span>
        )}
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-ink lg:text-3xl">
          {name}
        </h1>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-line"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted">
            {rating ? rating.toFixed(1) : "0.0"}
            {reviewCount ? ` · ${reviewCount} reviews` : ""}
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-ink">${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-lg text-muted line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-md bg-brand-soft px-2 py-0.5 text-sm font-medium text-brand">
              -{discount}%
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-5 text-sm leading-relaxed text-muted">
          {description ||
            "A timeless essential made from quality materials — lightweight, comfortable and endlessly versatile."}
        </p>

        {/* Color */}
        <div className="mt-6">
          <span className="text-sm font-medium text-ink">Color</span>
          <div className="mt-2 flex items-center gap-2">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  selectedColor === index ? "border-brand" : "border-line"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Color ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-6">
          <span className="text-sm font-medium text-ink">Size</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "border-brand bg-brand text-white"
                    : "border-line text-body hover:border-brand"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <span className="text-sm font-medium text-ink">Quantity</span>
          <div className="mt-2 flex w-fit items-center rounded-lg border border-line">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center text-body hover:text-brand"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium text-ink">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center text-body hover:text-brand"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="btn-primary h-12 flex-1 text-sm"
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <button onClick={handleBuyNow} disabled={!inStock} className="btn-outline h-12 flex-1 text-sm">
            Buy Now
          </button>
        </div>

        {/* Reassurance */}
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

export default ProductMain;
