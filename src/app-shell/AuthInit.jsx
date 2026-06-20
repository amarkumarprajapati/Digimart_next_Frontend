'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { auth } from "@/lib/auth";

export const AuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const isAuthenticated = auth.isAuthenticated();
    dispatch(setAuthStatus(isAuthenticated));
    if (isAuthenticated) {
      const storedUser = auth.getUser();
      if (storedUser) dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  return null;
};
