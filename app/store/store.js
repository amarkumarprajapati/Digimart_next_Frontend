import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import currentProductReducer from "./slices/currentProductSlice";
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";

/**
 * Helper: Save to localStorage
 */
const saveToLocalStorage = (key, value) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

/**
 * Helper: Load from localStorage
 */
const loadFromLocalStorage = (key, fallback) => {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

/**
 * Preloaded state from localStorage
 */
const preloadedState = {
  cart: loadFromLocalStorage("cart", {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
  }),
  auth: loadFromLocalStorage("auth", {
    isAuthenticated: false,
    user: null,
    loading: false,
  }),
  wishlist: loadFromLocalStorage("wishlist", {
    items: [],
  }),
};

/**
 * Redux Store Configuration
 */
const store = configureStore({
  reducer: {
    products: productReducer,
    currentProduct: currentProductReducer,
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

/**
 * Automatically save cart and auth to localStorage on state change
 */
store.subscribe(() => {
  const state = store.getState();
  saveToLocalStorage("cart", state.cart);
  saveToLocalStorage("auth", state.auth);
  saveToLocalStorage("wishlist", state.wishlist);
});

export default store;
