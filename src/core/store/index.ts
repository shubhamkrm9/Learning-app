import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { baseApi } from '../api/baseApi';
import appReducer from './appSlice';
import authReducer from './authSlice';
import moduleReducer from '../../features/modules/moduleSlice';
import assessmentReducer from '../../features/assessments/assessmentSlice';
import certificateReducer from '../../features/certificates/certificateSlice';
import progressReducer from '../../features/progress/progressSlice';
import { analyticsMiddleware } from './middleware/analyticsMiddleware';

export const createAppStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      modules: moduleReducer,
      assessments: assessmentReducer,
      certificates: certificateReducer,
      progress: progressReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, analyticsMiddleware),
  });
};

type StoreType = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<StoreType['getState']>;
export type AppDispatch = StoreType['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
