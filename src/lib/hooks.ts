import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";

import { IAlert, setToast } from "./slice/alert";
import { setTitle } from "./slice/layout";
import type { AppDispatch, AppStore, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppStore = useStore.withTypes<AppStore>();

export const cookie = new Cookies();

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

export const useEscapeKey = (callback?: () => void): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback]);
};

export const useAlert = () => {
  const dispatch = useAppDispatch();

  const alert = useAppSelector((state) => state.alert);

  const setAlert = (alert: IAlert) => {
    dispatch(setToast(alert));
  };

  return { alert, setAlert };
};

export const useDebounce = (
  callback: () => void,

  time: number,

  dependency: any
) => {
  useEffect(() => {
    const debounce = setTimeout(() => {
      callback();
    }, time);

    return () => clearTimeout(debounce);
  }, [dependency, callback, time]);

  return null;
};

export const usePageTitle = (title?: string) => {
  const dispatch = useAppDispatch();

  const { title: pageTitle } = useAppSelector((state) => state.layout);

  useEffect(() => {
    dispatch(setTitle(title));

    return () => {
      dispatch(setTitle(""));
    };
  }, [dispatch, title]);

  return { pageTitle };
};

export const usePage = () => {
  const [params, setParams] = useSearchParams();

  const page = params.get("page") || "1";

  const setPage = useCallback(
    (page: number) => {
      setParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", page.toString());

        return newParams;
      });
    },
    [setParams]
  );

  return { page: Number(page), setPage };
};

const BREAKPOINTS = {
  mobile: 768, // Anything less than 768px is considered mobile

  tablet: 1024, // Anything between 768px and 1024px is considered tablet
};

export const useScreenSize = () => {
  // Initialize the screen width state
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update the screen width on resize
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine the screen size categories
  const isMobile = screenWidth <= BREAKPOINTS.mobile;

  const isTablet =
    screenWidth > BREAKPOINTS.mobile && screenWidth <= BREAKPOINTS.tablet;

  const isDesktop = screenWidth > BREAKPOINTS.tablet;

  return { isMobile, isTablet, isDesktop };
};

export const useDebouncedSearch = (initialValue: string) => {
  const [search, setSearch] = useState(initialValue);

  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,
    [search]
  );

  return [debouncedSearch, setSearch, search] as [
    string,
    Dispatch<SetStateAction<string>>,
    string,
  ];
};

export const useStatusParams = () => {
  const [params] = useSearchParams();
  const paramStatus = params.get("status") || "";

  return paramStatus;
};
