import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./store";
import { MutableRefObject, useCallback, useEffect } from "react";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useOutsideClick = (
  ref: MutableRefObject<HTMLElement | null>,
  callBack: () => void
) => {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callBack();
      }
    },
    [ref, callBack] // Depend on ref and callBack to ensure stability
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  return null;
};
