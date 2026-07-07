import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ggc_token';
const USER_KEY = 'ggc_user';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Load from localStorage
const loadAuth = (): { user: AuthUser | null; token: string | null } => {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    return { token, user: user ? JSON.parse(user) : null };
  } catch {
    return { user: null, token: null };
  }
};

const { user: savedUser, token: savedToken } = loadAuth();

const initialState: AuthState = {
  user: savedUser,
  token: savedToken,
  loading: false,
  error: null,
};

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; phone: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data as { token: string; user: AuthUser };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data as { token: string; user: AuthUser };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };
    const handleFulfilled = (state: AuthState, action: PayloadAction<{ token: string; user: AuthUser }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      }
    };
    const handleRejected = (state: AuthState, action: PayloadAction<unknown>) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected);
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsLoggedIn = (state: { auth: AuthState }) => !!state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
