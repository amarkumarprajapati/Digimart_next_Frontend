'use client';

/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { Layout, Badge, Avatar, Drawer, Menu } from "antd";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu as MenuIcon,
  User,
  LogOut,
  Package,
  MapPin,
  Ticket,
  ChevronRight,
  X,
  Sparkles
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import newlogo from "@/assets/logonew.png";
import CartPage from "../Cart/Cart";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "@/lib/auth";
import { authService, productService } from "@/services/api/endpoints";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import SearchMegaMenu from "./SearchMegaMenu";
import { useAuthModal } from "@/hooks/useAuthModal";

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { openSignIn } = useAuthModal();
  const isHomePage = pathname === "/";

  const products = useSelector((state) => state?.cart?.cartItems || []);
  const user = useSelector((state) => state?.auth?.user || null);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isAuthenticated());
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const cartCount = products.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMegaSearchOpen, setIsMegaSearchOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = auth.isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated && !user) {
        try {
          const meResponse = await authService.getCurrentUser();
          if (meResponse?.data) {
            dispatch(setAuthStatus(true));
            dispatch(setUser(meResponse.data.data || meResponse.data));
          }
        } catch (error) {
          if (error.response?.status === 401) {
            auth.logout();
            setIsLoggedIn(false);
            dispatch(setAuthStatus(false));
            dispatch(setUser(null));
          }
        }
      }
    };

    checkAuth();
  }, [dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
    dispatch(setAuthStatus(false));
    dispatch(setUser(null));
    router.push("/");
  };

  const profileMenuItems = [
    { label: "My Profile", icon: User, path: "/my-profile" },
    { label: "Orders", icon: Package, path: "/orders" },
    { label: "Saved Addresses", icon: MapPin, path: "/saved-addresses" },
    { label: "Coupons", icon: Ticket, path: "/coupons" },
  ];

  const headerBgClass = "h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-[#088395]/10 sticky top-0";
  const textColorClass = "text-slate-900 dark:text-white";
  const iconColorClass = "text-slate-500 dark:text-slate-400 hover:bg-[#088395]/5 hover:text-[#088395] transition-all";
  const searchClass = "bg-slate-100/50 dark:bg-[#088395]/5 border border-slate-200/50 dark:border-[#088395]/10 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-[#088395]/10 transition-all";

  return (
    <>
      <header 
        className={`z-[100] transition-all duration-500 ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between gap-8">
          {/* Logo Section */}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => router.push("/")}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform duration-500">
                <img src={newlogo} alt="DigiMart" className="h-8 w-auto object-contain" />
              </div>
              <span className={`text-2xl font-black tracking-tighter transition-colors duration-500 ${textColorClass}`}>
                DIGI<span className="text-[#088395]">MART</span>
              </span>
            </div>
          </div>

          {/* Desktop Search Trigger */}
          <div 
            onClick={() => setIsMegaSearchOpen(true)}
            className={`flex-1 max-w-xl hidden lg:flex items-center gap-4 px-6 h-12 rounded-2xl border transition-all duration-500 cursor-pointer ${searchClass}`}
          >
            <Search className="w-5 h-5 text-[#088395]" />
            <span className="text-sm font-medium">Search for exclusive items...</span>
            <div className="ml-auto text-[10px] font-black px-2 py-1 rounded-md bg-gray-200/50 dark:bg-white/10 text-gray-400 uppercase tracking-tighter">
              ⌘K
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <button 
                onClick={() => router.push("/favorites")}
                className={`p-3 rounded-2xl transition-all relative ${iconColorClass}`}
              >
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-pink-500 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg">
                    {wishlistCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`p-3 rounded-2xl transition-all relative ${iconColorClass}`}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg animate-bounce-once">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className={`h-8 w-px mx-2 hidden lg:block ${(isScrolled || !isHomePage) ? "bg-slate-200" : "bg-white/20"}`} />

            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-2xl transition-all border ${
                    (isScrolled || !isHomePage) 
                      ? "bg-white border-slate-200 shadow-sm" 
                      : "glass border-white/20"
                  }`}
                >
                  <Avatar
                    src={user?.profilePicture}
                    className="border-2 border-white shadow-premium"
                    size={40}
                  />
                  <div className="text-left hidden xl:block">
                    <p className={`text-sm font-black leading-none mb-1 ${textColorClass}`}>
                      {user?.fullName?.split(' ')[0] || user?.name || 'User'}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${(isScrolled || !isHomePage) ? "text-slate-500" : "text-white/60"}`}>
                      Premium
                    </p>
                  </div>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-premium rounded-[1.5rem] border border-gray-100 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                    {/* User Header Section - More Compact */}
                    <div className="p-5 bg-gradient-to-br from-[#088395] to-cyan-600 relative overflow-hidden">
                      <div className="absolute -top-2 -right-2 p-4 opacity-10">
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border-2 border-white/20 p-0.5 flex-shrink-0">
                           <Avatar
                            src={user?.profilePicture}
                            className="w-full h-full rounded-lg"
                            size={44}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-white font-black text-sm tracking-tight leading-tight truncate">
                            {user?.fullName || user?.name}
                          </h3>
                          <p className="text-white/70 text-[8px] font-black uppercase tracking-widest mt-0.5">
                            Premium Member
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items - Tighter Layout */}
                    <div className="p-2 bg-white dark:bg-transparent">
                      <div className="grid grid-cols-1">
                        {profileMenuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => { router.push(item.path); setShowProfileDropdown(false); }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#088395] transition-all">
                              <item.icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest group-hover:text-[#088395]">
                              {item.label}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-[#088395] group-hover:translate-x-0.5 transition-all" />
                          </button>
                        ))}
                      </div>

                      <div className="h-px bg-gray-100 dark:bg-white/5 my-2 mx-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-500 hover:text-red-600 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-red-500 transition-all">
                          <LogOut className="w-4 h-4 group-hover:text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-premium hover:scale-105 active:scale-95 transition-all"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-3 rounded-2xl glass border border-white/20 text-white"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <CartPage open={isCartOpen} setOpen={setIsCartOpen} />

      <Drawer
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        closeIcon={<X className="w-6 h-6 text-slate-400" />}
        width={320}
        className="premium-drawer"
      >
        <div className="p-6">
          {/* Mobile drawer content simplified for brevity */}
          <div className="flex flex-col gap-4">
             {/* ... mobile items ... */}
          </div>
        </div>
      </Drawer>

      <SearchMegaMenu
        isOpen={isMegaSearchOpen}
        onClose={() => setIsMegaSearchOpen(false)}
      />
    </>
  );
};

export default HeaderComponent;
