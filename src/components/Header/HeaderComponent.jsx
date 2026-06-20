'use client';

import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu as MenuIcon,
  User,
  LogOut,
  Package,
  MapPin,
  Ticket,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "@/lib/auth";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useTheme } from "@/contexts/ThemeContext";
import CartSidebar from "../Cart/Cart";
import SearchMegaMenu from "./SearchMegaMenu";

const NAV_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PROFILE_LINKS = [
  { label: "My Profile", icon: User, path: "/my-profile" },
  { label: "Orders", icon: Package, path: "/orders" },
  { label: "Saved Addresses", icon: MapPin, path: "/saved-addresses" },
  { label: "Coupons", icon: Ticket, path: "/coupons" },
];

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { openSignIn } = useAuthModal();
  const { theme, toggleTheme } = useTheme();

  const cartItems = useSelector((state) => state?.cart?.cartItems || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const user = useSelector((state) => state?.auth?.user || null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const authenticated = auth.isAuthenticated();
    setIsLoggedIn(authenticated);
    if (authenticated && !user) {
      const storedUser = auth.getUser();
      if (storedUser) {
        dispatch(setAuthStatus(true));
        dispatch(setUser(storedUser));
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
    dispatch(setAuthStatus(false));
    dispatch(setUser(null));
    setShowProfile(false);
    router.push("/");
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-semibold tracking-tight text-ink">
              Digi<span className="text-brand">Mart</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-brand"
                    : "text-body hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search (desktop) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden lg:flex flex-1 max-w-sm items-center gap-3 rounded-lg border border-line bg-surface-2 px-4 h-10 text-muted hover:border-brand/40 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search products...</span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => router.push("/favorites")}
              className="relative p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] font-semibold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative ml-1" ref={profileRef}>
                <button
                  onClick={() => setShowProfile((s) => !s)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-soft text-brand font-semibold text-sm"
                  aria-label="Account"
                >
                  {(user?.fullName || user?.name || user?.email || "U").charAt(0).toUpperCase()}
                </button>

                {showProfile && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-line bg-surface shadow-premium overflow-hidden">
                    <div className="px-4 py-3 border-b border-line">
                      <p className="text-sm font-semibold text-ink truncate">
                        {user?.fullName || user?.name || "Welcome"}
                      </p>
                      <p className="text-xs text-muted truncate">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      {PROFILE_LINKS.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            router.push(item.path);
                            setShowProfile(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-body hover:bg-surface-2 transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-muted" />
                          {item.label}
                        </button>
                      ))}
                      <div className="my-1.5 h-px bg-line" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="btn-primary ml-2 hidden sm:inline-flex px-5 h-10 text-sm"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
              aria-label="Menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-surface border-l border-line p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-ink">Menu</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg text-body hover:bg-surface-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-body hover:bg-surface-2 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {!isLoggedIn && (
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  openSignIn();
                }}
                className="btn-primary mt-4 h-11 text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      <CartSidebar open={isCartOpen} setOpen={setIsCartOpen} />
      <SearchMegaMenu isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default HeaderComponent;
