'use client';

import { useDispatch, useSelector } from "react-redux";
import { auth } from "@/lib/auth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { showToast } from "@/lib/toast";
import { useAddToFavorites, useDeleteFavorite } from "@/services/api/favorites";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";

export const getFavoriteId = (item) => item?._id ?? item?.id ?? item?.Product_ID;

export const useFavoriteActions = () => {
  const dispatch = useDispatch();
  const { openSignIn } = useAuthModal();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlistItems = useSelector((state) => state?.wishlist?.items ?? []);
  const addFavorite = useAddToFavorites();
  const deleteFavorite = useDeleteFavorite();

  const isFavorite = (productOrId) => {
    const id =
      typeof productOrId === "string" || typeof productOrId === "number"
        ? productOrId
        : getFavoriteId(productOrId);
    return wishlistItems.some((item) => getFavoriteId(item) === id);
  };

  const toggleFavorite = async (product) => {
    if (!auth.isAuthenticated() && !isAuthenticated) {
      openSignIn();
      return;
    }

    const productId = getFavoriteId(product);
    if (!productId) return;

    const name = product?.name || product?.Product_name || "Product";
    const price = Number(product?.price ?? product?.Product_price ?? 0);
    const image = product?.Product_image || product?.image || "";

    try {
      if (isFavorite(productId)) {
        await deleteFavorite.mutateAsync(productId);
        dispatch(removeFromWishlist(productId));
        showToast.success("Removed from favorites");
      } else {
        await addFavorite.mutateAsync(productId);
        dispatch(
          addToWishlist({
            ...product,
            _id: productId,
            Product_ID: product?.Product_ID ?? productId,
            Product_name: name,
            Product_price: price,
            Product_image: image,
          })
        );
        showToast.success("Added to favorites");
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || "Could not update favorites");
    }
  };

  const removeFavoriteItem = async (productOrId) => {
    const productId =
      typeof productOrId === "string" || typeof productOrId === "number"
        ? productOrId
        : getFavoriteId(productOrId);

    if (!productId) return;

    if (!auth.isAuthenticated() && !isAuthenticated) {
      openSignIn();
      return;
    }

    try {
      await deleteFavorite.mutateAsync(productId);
      dispatch(removeFromWishlist(productId));
      showToast.success("Removed from favorites");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Could not remove favorite");
    }
  };

  return {
    isFavorite,
    toggleFavorite,
    removeFavoriteItem,
    isPending: addFavorite.isPending || deleteFavorite.isPending,
  };
};
