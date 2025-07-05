import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authSlice from './slices/authSlice';
import transactionSlice from './slices/transactionSlice';
import aiSlice from './slices/aiSlice';  // Add this

export const store = configureStore({
  reducer: {
    auth: authSlice,
    transactions: transactionSlice,
    ai: aiSlice,  // Add this
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;