import { configureStore } from "@reduxjs/toolkit";

import alert from "./slice/alert";
import auth from "./slice/auth";
import evidence from "./slice/evidence";
import layout from "./slice/layout";
import scroll from "./slice/scroll";

export const makeStore = () => {
  return configureStore({
    reducer: { auth, alert, layout, scroll, evidence },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
