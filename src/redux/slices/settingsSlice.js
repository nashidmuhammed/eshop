// redux/settingsSlice.js
"use client";
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Define your initial settings values here
  theme: 'light',
  language: 'en',
  notificationsEnabled: true,
  enableVariant: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
  },
});

// Export actions
export const { setTheme, setLanguage, toggleNotifications } = settingsSlice.actions;

// Export the reducer
export default settingsSlice.reducer;