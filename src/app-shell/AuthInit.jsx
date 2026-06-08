'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthStatus } from "@/store/slices/authSlice";
import { auth } from "@/lib/auth";

export const AuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthStatus(auth.isAuthenticated()));
  }, [dispatch]);

  return null;
};
