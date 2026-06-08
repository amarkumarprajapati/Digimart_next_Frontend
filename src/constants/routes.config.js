import { lazy } from "react";

export const routeConfig = [
  // Home
  {
    path: "/",
    element: lazy(() => import("@/features/home/Home")),
    isPrivate: false,
    showHeaderFooter: true,
  },

  // Products
  {
    path: "/products",
    element: lazy(() => import("@/features/products/listing/AllProductsPage")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  // Legacy / SEO friendly product route: /product/:slug/:id
  {
    path: "/product/:slug/:id",
    element: lazy(() => import("@/features/products/product-detail/ProductDetails")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/product-details/:id",
    element: lazy(() => import("@/features/products/product-detail/ProductDetails")),
    isPrivate: false,
    showHeaderFooter: true,
  },

  // Cart & Checkout
  {
    path: "/cart",
    element: lazy(() => import("@/features/cart/cart")),
    isPrivate: true,
    showHeaderFooter: true,
  },
  {
    path: "/checkout",
    element: lazy(() => import("@/features/checkout/checkout")),
    isPrivate: true,
    showHeaderFooter: true,
  },

  // Payment & Orders
  {
    path: "/PaymentPage",
    element: lazy(() => import("@/features/payment/PaymentPage")),
    isPrivate: true,
    showHeaderFooter: true,
  },
  {
    path: "/OrderConfirmation",
    element: lazy(() => import("@/features/orders/OrderConfirmation")),
    isPrivate: true,
    showHeaderFooter: true,
  },

  // User Profile & Wishlist
  {
    path: "/my-profile",
    element: lazy(() => import("@/features/user/UserDetails/MyProfilePage")),

    isPrivate: true,
    showHeaderFooter: true,
  },
  {
    path: "/orders",
    element: lazy(() => import("@/features/user/UserDetails/OrdersPage")),
    isPrivate: true,
    showHeaderFooter: true,
  },
  {
    path: "/saved-addresses",
    element: lazy(() => import("@/features/user/UserDetails/SavedAddressesPage")),
    isPrivate: true,
    showHeaderFooter: true,
  },
  {
    path: "/coupons",
    element: lazy(() => import("@/features/user/UserDetails/CouponsPage")),
    isPrivate: true,
    showHeaderFooter: true,
  },
  {
    path: "/favorites",
    element: lazy(() => import("@/features/favorites/FavoritesPage")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/wishlist",
    element: lazy(() => import("@/features/user/UserDetails/WishlistPage")),
    isPrivate: true,
    showHeaderFooter: true,
  },

  // Static Pages
  {
    path: "/about",
    element: lazy(() => import("@/features/static/about")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/contact",
    element: lazy(() => import("@/features/static/contact")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/faq",
    element: lazy(() => import("@/features/static/faq")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/terms",
    element: lazy(() => import("@/features/static/termsConditions")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/error",
    element: lazy(() => import("@/features/static/error")),
    isPrivate: false,
    showHeaderFooter: true,
  },
];
