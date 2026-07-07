import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Notification {
  _id: string;
  orderId: string;
  orderNumber: string;
  type: 'order_received' | 'order_ready' | 'general';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'ready_for_collection' | 'collected' | 'delivered';
  createdAt: string;
  notes?: string;
}

interface OrderState {
  orders: Order[];
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  lastOrderPhone: string;
}

const PHONE_KEY = 'ggc_order_phone';

const initialState: OrderState = {
  orders: [],
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  // Restore phone only on client, not during SSR
  lastOrderPhone: '',
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (
    payload: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      items: OrderItem[];
      totalAmount: number;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');
      return { order: data.data as Order, phone: payload.customerPhone };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchMine',
  async (phone: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/orders/mine?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
      return data.data as Order[];
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'orders/fetchNotifications',
  async (phone: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/orders/notifications?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { notifications: data.data as Notification[], unreadCount: data.unreadCount as number };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

export const markNotificationsRead = createAsyncThunk(
  'orders/markRead',
  async (phone: string, { rejectWithValue }) => {
    try {
      await fetch(`${API}/api/orders/notifications/read?phone=${encodeURIComponent(phone)}`, {
        method: 'POST',
      });
      return true;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLastOrderPhone(state, action: PayloadAction<string>) {
      state.lastOrderPhone = action.payload;
    },
    clearOrderError(state) {
      state.error = null;
    },
    // Called on client mount to restore phone from localStorage
    hydrateOrderPhone(state) {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(PHONE_KEY) || '';
        state.lastOrderPhone = saved;
      }
    },
  },
  extraReducers: (builder) => {
    // placeOrder
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload.order);
        state.lastOrderPhone = action.payload.phone;
        // Persist phone so bell works after refresh
        if (typeof window !== 'undefined') {
          localStorage.setItem(PHONE_KEY, action.payload.phone);
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchUserOrders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchNotifications
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      });

    // markNotificationsRead
    builder
      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
      });
  },
});

export const { setLastOrderPhone, clearOrderError, hydrateOrderPhone } = orderSlice.actions;

// Selectors
export const selectOrders = (state: { orders: OrderState }) => state.orders.orders;
export const selectNotifications = (state: { orders: OrderState }) => state.orders.notifications;
export const selectUnreadCount = (state: { orders: OrderState }) => state.orders.unreadCount;
export const selectOrderLoading = (state: { orders: OrderState }) => state.orders.loading;
export const selectOrderError = (state: { orders: OrderState }) => state.orders.error;
export const selectLastOrderPhone = (state: { orders: OrderState }) => state.orders.lastOrderPhone;

export default orderSlice.reducer;
