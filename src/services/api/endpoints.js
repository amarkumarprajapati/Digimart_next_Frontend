import api from "./client";

// ---------- AUTH ----------
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  refreshToken: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  googleLogin: (idToken) => api.post("/auth/google", { idToken }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
};

// ---------- PROFILE & ADDRESSES ----------
export const profileService = {
  getProfile: () => api.get("/user/profile/profile"),
  updateProfile: (data) => api.put("/user/profile/profile", data),
  uploadAvatar: (formData) =>
    api.post("/user/profile/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAddresses: () => api.get("/user/profile/addresses"),
  addAddress: (data) => api.post("/user/profile/addresses", data),
  updateAddress: (id, data) => api.put(`/v1/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/v1/addresses/${id}`),
  setDefaultAddress: (id) => api.patch(`/v1/addresses/${id}/set-default`),
};

// ---------- PRODUCTS ----------
const productListQuery = ({ page, limit, year } = {}) => {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));
  if (page) params.set("page", String(page));
  if (year) params.set("year", String(year));
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const productService = {
  getAllProducts: (page = 1, limit = 20, sort = "") =>
    api.get(`/products?page=${page}&limit=${limit}${sort ? `&sort=${encodeURIComponent(sort)}` : ""}`),
  searchProducts: (q = "", limit = 10) => {
    const params = new URLSearchParams();
    if (q?.trim()) params.set("q", q.trim());
    if (limit) params.set("limit", String(limit));
    const query = params.toString();
    return api.get(`/products/search${query ? `?${query}` : ""}`);
  },
  getNewProducts: (page = 1, limit = 8, year) =>
    api.get(`/products/new${productListQuery({ page, limit, year })}`),
  getPopularProducts: (page = 1, limit = 8, year) =>
    api.get(`/products/popular${productListQuery({ page, limit, year })}`),
  getTrendingProducts: (page = 1, limit = 8, year) =>
    api.get(`/products/trending${productListQuery({ page, limit, year })}`),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductBySlug: (slug) => api.get(`/user/products/slug/${slug}`),
  getProductDetail: (id) => api.get(`/products/${id}`),
  getNewArrivals: (page = 1, limit = 8, year) =>
    api.get(`/products/new${productListQuery({ page, limit, year })}`),
  getFeaturedProducts: () => api.get("/user/products/featured"),
  getProductsByCategory: (category, page = 1, limit = 10) =>
    api.get(`/user/products/category/${category}?page=${page}&limit=${limit}`),
  getSimilarProducts: (id) => api.get(`/user/products/${id}/similar`),
  recordProductView: (id) => api.post(`/user/products/${id}/view`),
  getRecentlyViewedProducts: () => api.get("/user/products/recently-viewed"),
};

// ---------- CATEGORIES ----------
export const categoryService = {
  getAllCategories: () => api.get("/user/categories"),
  getCategoryProducts: (id, page = 1, limit = 10) =>
    api.get(`/user/categories/${id}/products?page=${page}&limit=${limit}`),
  getTrendingCategories: () => api.get("/user/categories/trending"),
};

// ---------- REVIEWS ----------
export const reviewService = {
  getProductReviews: (productId, page = 1, limit = 10) =>
    api.get(`/user/products/${productId}/reviews?page=${page}&limit=${limit}`),
  createReview: (productId, data) => api.post(`/user/products/${productId}/reviews`, data),
  updateReview: (reviewId, data) => api.put(`/user/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/user/reviews/${reviewId}`),
  markReviewHelpful: (reviewId) => api.post(`/user/reviews/${reviewId}/helpful`),
};

// ---------- CART ----------
export const cartService = {
  getCart: () => api.get("/user/cart"),
  addToCart: (productId, quantity) => api.post("/user/cart/add", { productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/user/cart/update/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/user/cart/remove/${itemId}`),
  clearCart: () => api.delete("/user/cart/clear"),
  syncCart: (items) => api.post("/user/cart/sync", { items }),
};

// ---------- WISHLIST ----------
export const wishlistService = {
  getWishlist: () => api.get("/v1/wishlist"),
  addToWishlist: (productId) => api.post("/user/wishlist/add", { productId }),
  removeFromWishlist: (productId) => api.delete(`/user/wishlist/remove/${productId}`),
  moveToCart: (productId) => api.post(`/user/wishlist/move-to-cart/${productId}`),
};

// ---------- COUPONS ----------
export const couponService = {
  getAvailableCoupons: () => api.get("/user/coupons/my-coupons"),
  validateCoupon: (code, cartTotal) => api.post("/user/coupons/validate", { code, cartTotal }),
  applyCoupon: (code) => api.post("/user/coupons/apply", { code }),
  getMyCoupons: () => api.get("/user/coupons/my-coupons"),
};

// ---------- ORDERS ----------
export const orderService = {
  createOrder: (data) => api.post("/user/orders", data),
  getMyOrders: () => api.get("user/orders"),
  getOrderById: (id) => api.get(`user/orders/${id}`),
  cancelOrder: (id) => api.post(`/user/orders/${id}/cancel`),
  trackOrder: (id) => api.get(`/user/orders/${id}/track`),
  returnOrder: (id, data) => api.post(`/user/orders/${id}/return`, data),
  getOrderInvoice: (id) => api.get(`/user/orders/${id}/invoice`),
};

// ---------- PAYMENT ----------
export const paymentService = {
  createPaymentIntent: (data) => api.post("/user/payment/create-intent", data),
  verifyPayment: (data) => api.post("/user/payment/verify", data),
  getPaymentMethods: () => api.get("/user/payment/methods"),
  savePaymentMethod: (data) => api.post("/user/payment/save-method", data),
  deletePaymentMethod: (id) => api.delete(`/user/payment/methods/${id}`),
};

// ---------- NOTIFICATIONS ----------
export const notificationService = {
  getNotifications: (page = 1, limit = 20, read = null) =>
    api.get(`/user/notifications?page=${page}&limit=${limit}${read !== null ? `&read=${read}` : ""}`),
  markAsRead: (id) => api.patch(`/user/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/user/notifications/mark-all-read"),
  deleteNotification: (id) => api.delete(`/user/notifications/${id}`),
};

// ---------- NEWSLETTER ----------
export const newsletterService = {
  subscribe: (email) => api.post("/user/newsletter/subscribe", { email }),
  unsubscribe: (email, token) => api.post("/user/newsletter/unsubscribe", { email, token }),
};

// ---------- CONTACT ----------
export const contactService = {
  submitContactMessage: (data) => api.post("/user/contact", data),
};

// ---------- SUPPORT ----------
export const supportService = {
  createTicket: (data) => api.post("/user/support/ticket", data),
  getMyTickets: () => api.get("/user/support/tickets"),
  getTicketDetails: (id) => api.get(`/user/support/tickets/${id}`),
  replyToTicket: (id, message) => api.post(`/user/support/tickets/${id}/reply`, { message }),
};

// ---------- RECOMMENDATIONS ----------
export const recommendationService = {
  getRecommendations: () => api.get("/user/recommendations"),
};

// ---------- COMPARE ----------
export const compareService = {
  getCompareList: () => api.get("/user/compare"),
  addToCompare: (productId) => api.post("/user/compare/add", { productId }),
  removeFromCompare: (productId) => api.delete(`/user/compare/remove/${productId}`),
};

// ---------- FILTERS ----------
export const filterService = {
  getBrands: () => api.get("/user/filters/brands"),
  getPriceRange: (category) =>
    api.get(`/user/filters/price-range${category ? `?category=${category}` : ""}`),
  getAttributes: (category) =>
    api.get(`/user/filters/attributes${category ? `?category=${category}` : ""}`),
};

// ---------- HOMEPAGE ----------
export const homepageService = {
  getBanners: () => api.get("/user/homepage/banners"),
  getDeals: () => api.get("/user/homepage/deals"),
  getCategoriesSpotlight: () => api.get("/user/homepage/categories-spotlight"),
};

// ---------- ANALYTICS ----------
export const analyticsService = {
  trackEvent: (eventData) => api.post("/user/analytics/event", eventData),
  trackPageView: (pageData) => api.post("/user/analytics/page-view", pageData),
};
