'use client';

/* eslint-disable */
import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

const routeLabels = {
  "/": "Home",
  "/my-profile": "My Profile",
  "/orders": "Orders",
  "/saved-addresses": "Addresses",
  "/coupons": "Coupons",
  "/products": "Products",
  "/favorites": "Favorites",
  "/wishlist": "Wishlist",
  "/about": "About Us",
  "/contact": "Contact",
  "/faq": "FAQ",
  "/terms": "Terms & Conditions",
};

const ProfileBreadcrumb = ({ customTrail }) => {
  const currentPath = usePathname();

  const generateTrail = () => {
    if (customTrail) return customTrail;
    
    const paths = currentPath.split("/").filter(Boolean);
    const trail = [{ label: "Home", path: "/" }];
    
    let cumulativePath = "";
    paths.forEach((p, i) => {
      cumulativePath += `/${p}`;
      const label = routeLabels[cumulativePath] || p.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      trail.push({ label, path: cumulativePath });
    });
    
    return trail;
  };

  const trail = generateTrail();

  return (
    <nav className="flex items-center gap-1.5 py-2 text-[9px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-4 duration-500" aria-label="Breadcrumb">
      {trail.map((crumb, index) => {
        const isLast = index === trail.length - 1;
        return (
          <Fragment key={crumb.path + index}>
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0 mx-0.5" />
            )}
            {isLast ? (
              <span className="text-[#088395] font-black truncate max-w-[150px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.path}
                className="flex items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-[#088395] dark:hover:text-[#088395] transition-all active:scale-95"
              >
                {index === 0 && <Home className="w-3 h-3" />}
                <span className={index === 0 ? "hidden sm:inline" : ""}>{crumb.label}</span>
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};

export default ProfileBreadcrumb;
