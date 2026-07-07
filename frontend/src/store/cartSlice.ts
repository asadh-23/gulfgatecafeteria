import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@/src/types';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isOrderModalOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  isOrderModalOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<MenuItem>) {
      const existing = state.items.find(
        (i) => (i._id || i.id) === (action.payload._id || action.payload.id)
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (i) => (i._id || i.id) !== action.payload
      );
    },
    incrementQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(
        (i) => (i._id || i.id) === action.payload
      );
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(
        (i) => (i._id || i.id) === action.payload
      );
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(
            (i) => (i._id || i.id) !== action.payload
          );
        } else {
          item.quantity -= 1;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    openCart(state) {
      state.isOpen = true;
    },
    closeCart(state) {
      state.isOpen = false;
    },
    openOrderModal(state) {
      state.isOrderModalOpen = true;
    },
    closeOrderModal(state) {
      state.isOrderModalOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  openOrderModal,
  closeOrderModal,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartIsOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectOrderModalOpen = (state: { cart: CartState }) => state.cart.isOrderModalOpen;

export default cartSlice.reducer;
