import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@/src/types';

interface SavedState {
  items: MenuItem[];
}

// Load from localStorage on init
const loadSaved = (): MenuItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('ggc_saved');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToDisk = (items: MenuItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ggc_saved', JSON.stringify(items));
};

const initialState: SavedState = {
  items: [],
};

const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    // Called once on app mount to hydrate from localStorage
    hydrateSaved(state) {
      state.items = loadSaved();
    },

    toggleSaved(state, action: PayloadAction<MenuItem>) {
      const id = action.payload._id || action.payload.id;
      const exists = state.items.find((i) => (i._id || i.id) === id);
      if (exists) {
        state.items = state.items.filter((i) => (i._id || i.id) !== id);
      } else {
        state.items.push(action.payload);
      }
      saveToDisk(state.items);
    },

    removeSaved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => (i._id || i.id) !== action.payload);
      saveToDisk(state.items);
    },

    clearSaved(state) {
      state.items = [];
      saveToDisk([]);
    },
  },
});

export const { hydrateSaved, toggleSaved, removeSaved, clearSaved } = savedSlice.actions;

// Selectors
export const selectSavedItems = (state: { saved: SavedState }) => state.saved.items;
export const selectSavedCount = (state: { saved: SavedState }) => state.saved.items.length;
export const selectIsSaved = (id: string) => (state: { saved: SavedState }) =>
  state.saved.items.some((i) => (i._id || i.id) === id);

export default savedSlice.reducer;
