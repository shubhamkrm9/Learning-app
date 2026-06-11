import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  baseUrl: string;
  accessToken: string;
  isReady: boolean;
  appVersion: string;
}

const initialState: AppState = {
  baseUrl: '',
  accessToken: '',
  isReady: false,
  appVersion: '1.0.0',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initializeApp(state, action: PayloadAction<{ baseUrl: string; accessToken: string }>) {
      state.baseUrl = action.payload.baseUrl;
      state.accessToken = action.payload.accessToken;
    },
    launchApp(state) {
      state.isReady = true;
    },
  },
});

export const { initializeApp, launchApp } = appSlice.actions;
export default appSlice.reducer;
