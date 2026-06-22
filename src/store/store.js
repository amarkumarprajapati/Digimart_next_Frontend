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
 * Redux Store Configuration
 * Note: cart/wishlist/auth are hydrated client-side in StoreHydration
 * to avoid SSR/client HTML mismatches.
 */
const store = configureStore({
  reducer: {
    products: productReducer,
    currentProduct: currentProductReducer,
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
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
