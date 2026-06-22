import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProduct: null,
  similarProducts: [],
  recentlyViewed: [],
};


const currentProductSlice = createSlice({
  name: 'currentProduct',
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      const apiData = action.payload;
      state.currentProduct = apiData?.product || apiData;
      state.similarProducts = apiData?.similarProducts || apiData?.relatedProducts || [];
      state.recentlyViewed = apiData?.relatedProducts || [];
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.similarProducts = [];
    },
  },
});

export const { setCurrentProduct, clearCurrentProduct } = currentProductSlice.actions;
export default currentProductSlice.reducer;
