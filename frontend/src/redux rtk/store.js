import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { distributedSystemApi } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [distributedSystemApi.reducerPath]: distributedSystemApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(distributedSystemApi.middleware)
});
setupListeners(store.dispatch);
