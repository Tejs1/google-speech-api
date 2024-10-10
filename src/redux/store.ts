import { configureStore } from "@reduxjs/toolkit";
import speechReducer from "./slices/speechSlice";

export const store = configureStore({
  reducer: {
    speech: speechReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
