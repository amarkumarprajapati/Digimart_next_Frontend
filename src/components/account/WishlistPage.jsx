'use client';

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { showToast } from "@/lib/toast";
import AccountLayout from "./AccountLayout";

const PLACEHOLDER = "https://placehold.co/200x200/f1f5f9/94a3b8?text=No+Image";

const WishlistPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector((state) => state?.wishlist?.items || []);

  const getId = (item) => item._id || item.id || item.Product_ID;
  const getName = (item) => item.name || item.Product_name || "Product";
  const getPrice = (item) => Number(item.price ?? item.Product_price ?? 0);
  const getImage = (item) => item.image || item.Product_image || PLACEHOLDER;

  const handleAddToCart = (item) => {
    const id = getId(item);
    dispatch(
      addToCart({
        ...item,
        Product_ID: id,
        Product_name: getName(item),
        Product_price: getPrice(item),
        Product_image: getImage(item),
      })
    );
    showToast.success("Added to cart");
  };

  const handleRemove = (item) => {
    dispatch(removeFromWishlist(getId(item)));
    showToast.success("Removed from wishlist");
  };

  return (
    <AccountLayout title="Wishlist" description="Items you've saved for later.">
      {items.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
            <Heart className="h-6 w-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-ink">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-muted">Save products you love to find them easily later.</p>
          <button onClick={() => router.push("/products")} className="btn-primary mt-6 h-10 px-5 text-sm">
            Browse products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={getId(item)} className="flex gap-4 rounded-xl border border-line p-4">
              <img
                src={getImage(item)}
                alt={getName(item)}
                className="h-24 w-24 rounded-lg border border-line object-cover"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <h4 className="truncate text-sm font-medium text-ink">{getName(item)}</h4>
                <p className="mt-1 text-base font-semibold text-ink">
                  ${getPrice(item).toFixed(2)}
                </p>
                <div className="mt-auto flex gap-2 pt-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn-primary h-9 flex-1 text-sm"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to cart
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default WishlistPage;
