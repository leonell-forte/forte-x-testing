// useAutofocus.ts
import { useEffect, useRef } from "react";

interface UseAutofocusOptions {
  /** Delay in ms before attempting focus */
  delay?: number;
  /** Maximum number of retry attempts */
  maxAttempts?: number;
  /** Interval between retry attempts in ms */
  retryInterval?: number;
  /** Condition to determine if focus should be attempted */
  shouldFocus?: boolean;
  /** Callback after successful focus */
  onFocused?: () => void;
}

export function useAutofocus<T extends HTMLElement = HTMLElement>(
  options: UseAutofocusOptions = {}
) {
  const {
    delay = 0,
    maxAttempts = 5,
    retryInterval = 100,
    shouldFocus = true,
    onFocused,
  } = options;

  const elementRef = useRef<T>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!shouldFocus) return;

    const element = elementRef.current;
    if (!element) return;

    // Initial focus attempt with optional delay
    const initialTimeout = setTimeout(() => {
      element.focus();
      onFocused?.();
    }, delay);

    // Retry mechanism
    const retryTimeout = setInterval(() => {
      if (attemptsRef.current >= maxAttempts) {
        clearInterval(retryTimeout);
        return;
      }

      if (document.activeElement !== element) {
        element.focus();
        attemptsRef.current += 1;
      } else {
        clearInterval(retryTimeout);
        onFocused?.();
      }
    }, retryInterval);

    // Cleanup
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(retryTimeout);
    };
  }, [delay, maxAttempts, retryInterval, shouldFocus, onFocused]);

  return elementRef;
}
