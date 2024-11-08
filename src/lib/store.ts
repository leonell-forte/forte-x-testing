import { configureStore } from "@reduxjs/toolkit";
import auth from "./slice/auth";
import alert from "./slice/alert";

export const makeStore = () => {
  return configureStore({
    reducer: { auth, alert },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
