'use client';

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "@/store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeInitScript } from "@/components/layout/ThemeInitScript";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthInit } from "./AuthInit";
import { StoreHydration } from "./StoreHydration";

const clientId = "798368534301-rap3d22s80ee83qbc7q33r3ab6lmbijs.apps.googleusercontent.com";

export const Providers = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        <Provider store={store}>
          <ThemeInitScript />
          <ThemeProvider>
            <StoreHydration />
            <AuthInit />
            {children}
            <ToastContainer newestOnTop limit={3} />
          </ThemeProvider>
        </Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};
