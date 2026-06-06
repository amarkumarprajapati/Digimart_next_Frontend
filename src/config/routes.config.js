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
    path: "/CartPage",
    element: lazy(() => import("@/features/cart/CartPage")),
    isPrivate: true,
    showHeaderFooter: true,
  },
  {
    path: "/CheckoutPage",
    element: lazy(() => import("@/features/checkout/CheckoutPage")),
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
    path: "/AboutUs",
    element: lazy(() => import("@/features/static/AboutUs")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/Contact",
    element: lazy(() => import("@/features/static/Contact")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/FAQ",
    element: lazy(() => import("@/features/static/FAQ")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/Terms",
    element: lazy(() => import("@/features/static/TermsConditions")),
    isPrivate: false,
    showHeaderFooter: true,
  },
  {
    path: "/ErrorPage",
    element: lazy(() => import("@/features/static/ErrorPage")),
    isPrivate: false,
    showHeaderFooter: true,
  },
];
