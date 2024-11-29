import { configureStore } from "@reduxjs/toolkit";
import auth from "./slice/auth";
import alert from "./slice/alert";
import scroll from "./slice/scroll";
import layout from "./slice/layout";

export const makeStore = () => {
  return configureStore({
    reducer: { auth, alert, layout, scroll },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
