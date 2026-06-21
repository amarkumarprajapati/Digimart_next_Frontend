'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { productDetailRoute } from "@/lib/routes";
import { showToast } from "@/lib/toast";

const PLACEHOLDER =
  "https://placehold.co/400x500/f1f5f9/94a3b8?text=No+Image";

const getId = (item) => item._id ?? item.id ?? item.Product_ID;
const getName = (item) => item.name ?? item.Product_name ?? "Product";
const getPrice = (item) => Number(item.price ?? item.Product_price ?? 0);
const getImage = (item) => item.image ?? item.Product_image ?? PLACEHOLDER;
const getCategory = (item) => item.category ?? item.Product_type ?? item.Product_category ?? "";
const getDiscount = (item) => Number(item.discount ?? item.Product_discount ?? 0);

const FavoritesPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector((state) => state?.wishlist?.items ?? []);

  const handleRemove = (item) => {
    dispatch(removeFromWishlist(getId(item)));
    showToast.success("Removed from favorites");
  };

  const handleAddToCart = (item) => {
    const id = getId(item);
    dispatch(
      addToCart({
        ...item,
        _id: id,
        Product_ID: id,
        Product_name: getName(item),
        Product_price: getPrice(item),
        Product_image: getImage(item),
      })
    );
    showToast.success("Added to cart");
  };

  const handleOpenProduct = (item) => {
    router.push(productDetailRoute(item));
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container-page py-6">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-ink">Favorites</span>
        </nav>

        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Favorites
            </h1>
            <p className="mt-1 text-sm text-muted">
              {items.length === 0
                ? "Save items you love and shop them later."
                : `${items.length} saved ${items.length === 1 ? "item" : "items"}`}
            </p>
          </div>
          {items.length > 0 && (
            <Link href="/products" className="text-sm font-medium text-brand hover:underline">
              Continue shopping
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="card mx-auto max-w-lg p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
              <Heart className="h-6 w-6 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-ink">No favorites yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Browse products and tap the heart icon to save them here for easy access.
            </p>
            <Link href="/products" className="btn-primary mt-6 inline-flex h-11 px-6 text-sm">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const id = getId(item);
              const name = getName(item);
              const price = getPrice(item);
              const image = getImage(item);
              const category = getCategory(item);
              const discount = getDiscount(item);
              const salePrice =
                discount > 0 ? price - (price * discount) / 100 : price;

              return (
                <article
                  key={id}
                  className="card group overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-surface-2">
                    <button
                      type="button"
                      onClick={() => handleOpenProduct(item)}
                      className="block h-full w-full"
                      aria-label={`View ${name}`}
                    >
                      <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PLACEHOLDER;
                        }}
                      />
                    </button>

                    {discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-0.5 text-xs font-medium text-white">
                        -{discount}%
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-muted shadow-soft transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    {category && (
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        {category}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenProduct(item)}
                      className="mt-1 line-clamp-2 text-left text-sm font-medium text-ink transition-colors hover:text-brand"
                    >
                      {name}
                    </button>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-ink">
                          ₹{Math.round(salePrice).toLocaleString()}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs text-muted line-through">
                            ₹{price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="btn-primary mt-4 h-10 w-full text-sm"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
