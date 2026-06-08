'use client';

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/Header/HeaderComponent";
import Footer from "@/components/footer/FooterComponent";
import AuthModal from "@/components/Modal/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";
import { auth } from "@/lib/auth";

const publicPaths = ["/", "/products", "/product", "/about", "/contact", "/faq", "/terms", "/favorites", "/error"];
const publicExact = ["/", "/products", "/about", "/contact", "/faq", "/terms", "/favorites", "/error"];

const isPublicPath = (pathname) => {
  if (publicExact.includes(pathname)) return true;
  if (pathname.startsWith("/product/")) return true;
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-12 max-w-md w-full text-center shadow-premium">
          <div className="w-20 h-20 bg-teal-50 dark:bg-[#088395]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#088395]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">Authentication Required</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
            You need to be signed in to access this section.
          </p>
          <button
            onClick={() => close("login")}
            className="w-full py-4 bg-[#088395] hover:bg-[#066a78] text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95 text-xs"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <main className="bg-gray-50 dark:bg-slate-950">
        {children}
      </main>
      <Footer />
      <AuthModal isOpen={isOpen} onClose={close} defaultTab={defaultTab} />
    </div>
  );
};

export default MainLayout;
