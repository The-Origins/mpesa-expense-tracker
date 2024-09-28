import { persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer"; // Combined reducer

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
