import { createSlice } from '@reduxjs/toolkit';

const saveCartToStorage = (state) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  } catch (error) {
    // ignore localStorage errors (e.g., private mode, quota exceeded)
    console.error('Failed to save cart to localStorage', error);
  }
};

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i.Product_ID === item.Product_ID);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalPrice += item.Product_price;

      saveCartToStorage(state);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.cartItems.findIndex((i) => i.Product_ID === itemId);

      if (itemIndex !== -1) {
        const item = state.cartItems[itemIndex];
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.Product_price * item.quantity;
        state.cartItems.splice(itemIndex, 1);
      }

      saveCartToStorage(state);
    },

    // Alias used by Cart components
    removeItem: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.cartItems.findIndex((i) => i.Product_ID === itemId);

      if (itemIndex !== -1) {
        const item = state.cartItems[itemIndex];
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.Product_price * item.quantity;
        state.cartItems.splice(itemIndex, 1);
      }

      saveCartToStorage(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.Product_ID === id);
      if (item && Number.isInteger(quantity) && quantity >= 1) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;
        state.totalQuantity += diff;
        state.totalPrice += diff * item.Product_price;
      }

      saveCartToStorage(state);
    },

    hydrateCart: (_, action) => action.payload,
  },
});

export const { addToCart, removeFromCart, removeItem, updateQuantity, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
