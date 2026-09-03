import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  email: '',
  softwarePlan: '',
  expiryDate: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.softwarePlan = action.payload.softwarePlan;
      state.expiryDate = action.payload.expiryDate;
    },
    clearUserDetails: (state) => {
      state.username = '';
      state.email = '';
      state.softwarePlan = '';
      state.expiryDate = '';
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;

export default userSlice.reducer;