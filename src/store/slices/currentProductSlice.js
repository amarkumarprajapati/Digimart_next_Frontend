import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error('Failed to load from localStorage', error);
    return fallback;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // ignore localStorage errors (e.g., quota exceeded)
    console.error('Failed to save to localStorage', error);
  }
};

const initialState = {
  currentProduct: loadFromLocalStorage('currentProduct', null),
  similarProducts: [],
  recentlyViewed: [],
};


const currentProductSlice = createSlice({
  name: 'currentProduct',
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      const apiData = action.payload;
      // Handle the full API response structure
      state.currentProduct = apiData?.product || apiData;
      state.similarProducts = apiData?.relatedProducts || [];
      state.recentlyViewed = apiData?.relatedProducts || [];
      saveToLocalStorage('currentProduct', state.currentProduct);
    },
  },
});

export const { setCurrentProduct } = currentProductSlice.actions;
export default currentProductSlice.reducer;
