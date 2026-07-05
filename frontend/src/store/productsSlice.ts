import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@/src/types';
import { menuItems } from '@/src/data/menu';

interface ProductsState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  activeCategory: string;
}

const initialState: ProductsState = {
  items: menuItems as MenuItem[],
  loading: false,
  error: null,
  activeCategory: 'all',
};

// Async thunk to fetch products from backend
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?isActive=true`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        return data.data as MenuItem[];
      }
      return menuItems as MenuItem[]; // fallback to static data
    } catch {
      return rejectWithValue('Could not load products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setActiveCategory(state, action: PayloadAction<string>) {
      state.activeCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        // Keep static fallback data on error
      });
  },
});

export const { setActiveCategory } = productsSlice.actions;
export default productsSlice.reducer;
