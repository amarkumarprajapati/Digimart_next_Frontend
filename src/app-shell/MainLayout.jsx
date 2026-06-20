'use client';

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/Header/HeaderComponent";
import Footer from "@/components/footer/FooterComponent";
import AuthModal from "@/components/Modal/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";
import { auth } from "@/lib/auth";

const publicExact = ["/", "/products", "/cart", "/about", "/contact", "/faq", "/terms", "/favorites", "/error"];

const isPublicPath = (pathname) => {
  if (publicExact.includes(pathname)) return true;
  if (pathname.startsWith("/product/")) return true;
  if (pathname.startsWith("/product-details/")) return true;
  return false;
};

const MainLayout = ({ children }) => {
  const { isOpen, defaultTab, close } = useAuthModal();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthPage = pathname === "/signin" || pathname === "/signup";
    if (!isPublicPath(pathname) && !isAuthenticated && !isAuthPage) {
      close();
    }
  }, [pathname, isAuthenticated, close]);

  if (!isPublicPath(pathname) && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-8">
        <div className="card p-10 max-w-md w-full text-center shadow-premium">
          <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-ink mb-2">Sign in required</h2>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            You need to be signed in to access this section.
          </p>
          <button
            onClick={() => close("login")}
            className="btn-primary w-full h-11 text-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal isOpen={isOpen} onClose={close} defaultTab={defaultTab} />
    </div>
  );
};

export default MainLayout;
