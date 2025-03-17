import { configureStore } from "@reduxjs/toolkit";

import alert from "./slice/alert";
import auth from "./slice/auth";
import confirmPrompt from "./slice/confirm-prompt";
import customPrompt from "./slice/custom-prompt";
import evidence from "./slice/evidence";
import layout from "./slice/layout";
import modal from "./slice/modal";
import partners from "./slice/partners";
import scroll from "./slice/scroll";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth,
      alert,
      layout,
      scroll,
      evidence,
      confirmPrompt,
      customPrompt,
      partners,
      modal,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
