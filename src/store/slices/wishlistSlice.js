import { createSlice } from '@reduxjs/toolkit';

const matchId = (item, id) =>
  (item._id ?? item.id ?? item.Product_ID) === id;

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    setWishlistItems: (state, action) => {
      state.items = action.payload;
    },
    addToWishlist: (state, action) => {
      const product = action.payload;
      const id = product._id ?? product.id ?? product.Product_ID;
      if (!state.items.some((item) => matchId(item, id))) {
        state.items.push(product);
      }
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const id = product._id ?? product.id ?? product.Product_ID;
      const index = state.items.findIndex((item) => matchId(item, id));
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => !matchId(item, id));
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  setWishlistItems,
  addToWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
