'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Tooltip, ConfigProvider, Dropdown, theme as antTheme } from "antd";
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
  ChevronDown,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { auth, getDisplayName } from "@/lib/auth";
import { authService, productService } from "@/services/api/endpoints";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useTheme } from "@/contexts/ThemeContext";
import CartSidebar from "../Cart/Cart";
import HeaderSearchBox from "./HeaderSearchBox";
import { productDetailRoute, productsRoute } from "@/lib/routes";

const SHOP_CATEGORIES = [
  { name: "Clothing", slug: "clothing" },
  { name: "Home", slug: "home" },
  { name: "Beauty", slug: "beauty" },
  { name: "Accessories", slug: "accessories" },
];

const navLinkClass = (active) =>
  `text-sm font-medium transition-colors ${active ? "text-brand" : "text-body hover:text-brand"}`;

const PROFILE_LINKS = [
  { label: "My Profile", icon: User, path: "/my-profile" },
  { label: "Orders", icon: Package, path: "/orders" },
  { label: "Saved Addresses", icon: MapPin, path: "/saved-addresses" },
  { label: "Coupons", icon: Ticket, path: "/coupons" },
];

const parseSearchResults = (response) => {
  const data = response?.data?.data ?? response?.data;
  const list = Array.isArray(data?.products)
    ? data.products
    : Array.isArray(data)
      ? data
      : data?.items ?? data?.data ?? [];
  return Array.isArray(list) ? list : [];
};

const ACTION_TOOLTIP = {
  mouseEnterDelay: 0,
  mouseLeaveDelay: 0,
  placement: "bottom",
};

const ActionTooltip = ({ title, children }) => (
  <Tooltip title={title} {...ACTION_TOOLTIP}>
    {children}
  </Tooltip>
);

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category")?.toLowerCase() || "";
  const isShopActive = pathname === "/products" && !activeCategory;
  const isCategoriesActive = pathname === "/products" && !!activeCategory;
  const { openSignIn } = useAuthModal();
  const { theme, toggleTheme } = useTheme();

  const cartItems = useSelector((state) => state?.cart?.cartItems || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const user = useSelector((state) => state?.auth?.user || null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const debounceRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  const fetchSuggestions = useCallback(async (q = "") => {
    setSearchLoading(true);
    try {
      const response = await productService.searchProducts(q, 8);
      setSuggestions(parseSearchResults(response));
    } catch {
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchOpenChange = (open) => {
    setSearchOpen(open);
    if (open) fetchSuggestions(searchQuery);
  };

  const handleQueryChange = (value) => {
    setSearchQuery(value);
    setSearchOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchLoading(true);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(productsRoute({ search: searchQuery.trim() }));
    closeSearch();
  };

  const handleProductClick = (product) => {
    router.push(productDetailRoute(product));
    setSearchQuery("");
    setSuggestions([]);
    closeSearch();
  };

  const handleViewAllResults = () => {
    if (!searchQuery.trim()) return;
    router.push(productsRoute({ search: searchQuery.trim() }));
    closeSearch();
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((open) => {
      const next = !open;
      if (next) {
        setSearchOpen(true);
        fetchSuggestions(searchQuery);
      } else {
        setSearchOpen(false);
      }
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      /* clear local session even if API fails */
    }
    auth.logout();
    setIsLoggedIn(false);
    dispatch(setAuthStatus(false));
    dispatch(setUser(null));
    setShowProfile(false);
    router.push("/");
  };

  const isActive = (href) => pathname === href;

  const categoryMenuItems = [
    {
      key: "all",
      label: (
        <Link href="/products" className="block py-0.5">
          All products
        </Link>
      ),
    },
    { type: "divider" },
    ...SHOP_CATEGORIES.map((cat) => ({
      key: cat.slug,
      label: (
        <Link href={productsRoute({ category: cat.slug })} className="block py-0.5">
          {cat.name}
        </Link>
      ),
    })),
  ];

  const searchVisible = isDesktop || isMobileSearchOpen;

  const searchBoxProps = {
    query: searchQuery,
    onQueryChange: handleQueryChange,
    suggestions,
    loading: searchLoading,
    open: searchOpen && searchVisible,
    onOpenChange: handleSearchOpenChange,
    onSubmit: handleSearchSubmit,
    onProductClick: handleProductClick,
    onViewAll: handleViewAllResults,
  };

  const searchField = searchVisible ? (
    <HeaderSearchBox
      {...searchBoxProps}
      className={isDesktop ? "w-full" : "w-full"}
      autoFocus={!isDesktop && isMobileSearchOpen}
    />
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-semibold tracking-tight text-ink">
              Digi<span className="text-brand">Mart</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className={navLinkClass(isShopActive)}>
              Shop
            </Link>

            <Dropdown
              menu={{ items: categoryMenuItems }}
              trigger={["hover"]}
              mouseEnterDelay={0}
              mouseLeaveDelay={0.1}
            >
              <button
                type="button"
                className={`flex items-center gap-1 ${navLinkClass(isCategoriesActive)}`}
              >
                Categories
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </Dropdown>

            <Link href="/about" className={navLinkClass(isActive("/about"))}>
              About
            </Link>
            <Link href="/contact" className={navLinkClass(isActive("/contact"))}>
              Contact
            </Link>
          </nav>

          {isDesktop && (
            <div className="flex-1 max-w-sm">{searchField}</div>
          )}

          <ConfigProvider
            theme={{
              algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
              token: { colorPrimary: "#0d9488", borderRadius: 8 },
            }}
          >
          <div className="flex items-center gap-1">
            <ActionTooltip title="Search">
              <button
                type="button"
                onClick={toggleMobileSearch}
                className="lg:hidden p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </ActionTooltip>

            <ActionTooltip title={theme === "dark" ? "Light mode" : "Dark mode"}>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </ActionTooltip>

            <ActionTooltip title="Favorites">
              <button
                type="button"
                onClick={() => router.push("/favorites")}
                className="relative p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] font-semibold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </ActionTooltip>

            <ActionTooltip title="Cart">
              <button
                type="button"
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
            </ActionTooltip>

            {isLoggedIn ? (
              <div className="relative ml-1" ref={profileRef}>
                <ActionTooltip title="Account">
                  <button
                    type="button"
                    onClick={() => setShowProfile((s) => !s)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-soft text-brand font-semibold text-sm"
                    aria-label="Account"
                  >
                    {(getDisplayName(user) || user?.email || "U").charAt(0).toUpperCase()}
                  </button>
                </ActionTooltip>

                {showProfile && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-line bg-surface shadow-premium overflow-hidden">
                    <div className="px-4 py-3 border-b border-line">
                      <p className="text-sm font-semibold text-ink truncate">
                        {getDisplayName(user) || "Welcome"}
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

            <ActionTooltip title="Menu">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden p-2.5 rounded-lg text-body hover:bg-surface-2 transition-colors"
                aria-label="Menu"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
            </ActionTooltip>
          </div>
          </ConfigProvider>
        </div>

        {!isDesktop && isMobileSearchOpen && (
          <div className="container-page pb-3">{searchField}</div>
        )}
      </header>

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
              <Link
                href="/products"
                onClick={() => setIsDrawerOpen(false)}
                className={`px-3 py-2.5 rounded-lg hover:bg-surface-2 font-medium ${isShopActive ? "text-brand bg-brand-soft/40" : "text-body"}`}
              >
                Shop all
              </Link>

              <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Categories
              </p>
              {SHOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={productsRoute({ category: cat.slug })}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`px-3 py-2.5 rounded-lg hover:bg-surface-2 font-medium ${
                    activeCategory === cat.slug ? "text-brand bg-brand-soft/40" : "text-body"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="my-2 h-px bg-line" />

              <Link
                href="/about"
                onClick={() => setIsDrawerOpen(false)}
                className={`px-3 py-2.5 rounded-lg hover:bg-surface-2 font-medium ${isActive("/about") ? "text-brand" : "text-body"}`}
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsDrawerOpen(false)}
                className={`px-3 py-2.5 rounded-lg hover:bg-surface-2 font-medium ${isActive("/contact") ? "text-brand" : "text-body"}`}
              >
                Contact
              </Link>
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
    </>
  );
};

export default HeaderComponent;
