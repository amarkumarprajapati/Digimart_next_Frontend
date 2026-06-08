/* eslint-disable */
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  User,
  Package,
  MapPin,
  Ticket,
  Heart,
  ChevronRight,
  Menu,
  X,
  Home,
} from "lucide-react";
import ProfileBreadcrumb from "@/components/Breadcrumbs/ProfileBreadcrumb";

import { useDispatch } from "react-redux";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { auth } from "@/utils/auth";

const tabs = [
  { key: "profile", label: "My Profile", icon: User, path: "/my-profile" },
  { key: "orders", label: "Orders", icon: Package, path: "/orders" },
  { key: "addresses", label: "Addresses", icon: MapPin, path: "/saved-addresses" },
  { key: "coupons", label: "Coupons", icon: Ticket, path: "/coupons" },
  { key: "wishlist", label: "Wishlist", icon: Heart, path: "/wishlist" },
];

const ProfileLayout = ({ children }) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    dispatch(setAuthStatus(false));
    dispatch(setUser(null));
    push("/");
  };

  const activeTab =
    tabs.find((t) => pathname.startsWith(t.path))?.key || "profile";

  const handleTabClick = (tab) => {
    push(tab.path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <ProfileBreadcrumb />

        <div className="flex flex-col lg:flex-row gap-10 items-stretch animate-in fade-in zoom-in-95 duration-700">
          {/* Sidebar - Modern & Fixed-ish */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 p-4 shadow-premium overflow-hidden h-full">
              {/* User Identity */}
              <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-50 dark:border-gray-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#088395] to-cyan-600 p-1 mb-3 shadow-lg shadow-teal-500/10">
                  <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                     <span className="text-2xl font-black text-[#088395]">
                      {(user?.fullName || user?.name || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight truncate w-full">
                  {user?.fullName || user?.name || "Premium User"}
                </h3>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleTabClick(tab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                        isActive
                          ? "bg-[#088395] text-white shadow-lg shadow-teal-500/20"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <Icon size={16} className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-[#088395]"} transition-colors`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-white" : "group-hover:text-[#088395]"}`}>
                        {tab.label}
                      </span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto" />}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions / Help */}
              <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
                >
                   <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center group-hover:bg-red-500 transition-all">
                      <X size={14} className="group-hover:text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 p-4 md:p-6 shadow-premium h-full max-h-[calc(100vh-8rem)] overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
