import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  title?: string;
  message?: string;
  type?: ToastType;
  duration?: number; // ms
}

const initialState: ToastState = {
  visible: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<Omit<ToastState, 'visible'>>) {
      state.visible = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.type = action.payload.type ?? 'success';
      state.duration = action.payload.duration ?? 4000;
    },
    hideToast(state) {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export const selectToast = (state: { toast: ToastState }) => state.toast;
export default toastSlice.reducer;
