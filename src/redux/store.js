// redux/store.js
"use client"
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    user: userReducer,
  },
});

export default store;