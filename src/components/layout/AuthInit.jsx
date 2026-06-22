'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { setWishlistItems, clearWishlist } from "@/store/slices/wishlistSlice";
import { auth } from "@/lib/auth";
import { favoritesService } from "@/services/api/endpoints";
import { extractFavoriteItems } from "@/services/api/favorites";

export const AuthInit = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const authenticated = auth.isAuthenticated();
    dispatch(setAuthStatus(authenticated));
    if (authenticated) {
      const storedUser = auth.getUser();
      if (storedUser) dispatch(setUser(storedUser));
    } else {
      dispatch(clearWishlist());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearWishlist());
      return;
    }

    favoritesService
      .getFavorites()
      .then((res) => {
        const data = res?.data?.data ?? res?.data;
        dispatch(setWishlistItems(extractFavoriteItems(data)));
      })
      .catch(() => {
        dispatch(clearWishlist());
      });
  }, [isAuthenticated, dispatch]);

  return null;
};
