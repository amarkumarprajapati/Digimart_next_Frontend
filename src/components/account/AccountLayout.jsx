'use client';

import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { User, Package, MapPin, Ticket, Heart, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { auth } from "@/lib/auth";

const TABS = [
  { label: "My Profile", icon: User, path: "/my-profile" },
  { label: "Orders", icon: Package, path: "/orders" },
  { label: "Addresses", icon: MapPin, path: "/saved-addresses" },
  { label: "Coupons", icon: Ticket, path: "/coupons" },
  { label: "Wishlist", icon: Heart, path: "/wishlist" },
];

const AccountLayout = ({ title, description, actions, toolbar, children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    auth.logout();
    dispatch(setAuthStatus(false));
    dispatch(setUser(null));
    router.push("/");
  };

  return (
    <div className="bg-canvas">
      <div className="container-page flex flex-col py-6 lg:h-[calc(100vh-4rem)]">
        {/* Breadcrumb */}
        <nav className="mb-4 flex shrink-0 items-center gap-1.5 text-sm text-muted">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-ink">{title}</span>
        </nav>

        <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            <div className="card flex flex-col overflow-hidden lg:h-full">
              <div className="flex shrink-0 items-center gap-3 border-b border-line p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-semibold text-brand">
                  {(user?.fullName || user?.name || user?.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {user?.fullName || user?.name || "Welcome"}
                  </p>
                  <p className="truncate text-xs text-muted">{user?.email}</p>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto p-2">
                {TABS.map((tab) => {
                  const active = pathname.startsWith(tab.path);
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.path}
                      onClick={() => router.push(tab.path)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active ? "bg-brand text-white" : "text-body hover:bg-surface-2"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
                <div className="my-2 h-px bg-line" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content box */}
          <main className="min-w-0 flex-1 lg:h-full">
            <div className="card flex flex-col overflow-hidden lg:h-full">
              {/* Header (fixed) */}
              <div className="flex shrink-0 flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
                  {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
                </div>
                {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
              </div>

              {/* Toolbar (fixed) */}
              {toolbar && (
                <div className="shrink-0 border-b border-line p-4">{toolbar}</div>
              )}

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto p-5">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
