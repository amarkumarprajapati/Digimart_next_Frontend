'use client';

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { hydrateCart } from "@/store/slices/cartSlice";
import { setWishlistItems } from "@/store/slices/wishlistSlice";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { auth, normalizeUser } from "@/lib/auth";

const loadFromLocalStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const StoreHydration = () => {
  const dispatch = useDispatch();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const cart = loadFromLocalStorage("cart", {
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,
    });
    dispatch(hydrateCart(cart));

    const wishlist = loadFromLocalStorage("wishlist", { items: [] });
    dispatch(setWishlistItems(Array.isArray(wishlist.items) ? wishlist.items : []));

    const storedAuth = loadFromLocalStorage("auth", null);
    const tokenAuthenticated = auth.isAuthenticated();

    if (tokenAuthenticated) {
      dispatch(setAuthStatus(true));
      const user = auth.getUser() || storedAuth?.user;
      if (user) dispatch(setUser(normalizeUser(user)));
    } else if (storedAuth?.isAuthenticated && storedAuth?.user) {
      dispatch(setAuthStatus(true));
      dispatch(setUser(normalizeUser(storedAuth.user)));
    }
  }, [dispatch]);

  return null;
};
