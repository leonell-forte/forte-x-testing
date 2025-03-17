import { useEffect, useRef } from "react";
import type { Path, UseFormReturn } from "react-hook-form";

type AutoSaveOptions = {
  /**
   * Unique identifier for the form in localStorage
   */
  formId: string;
  /**
   * Time in milliseconds before saving after inactivity (default: 2 minutes)
   */
  idleTime?: number;
  /**
   * Whether to enable auto-save (default: true)
   */
  enabled?: boolean;
  /**
   * Optional callback when form is saved
   */
  onSave?: (data: any) => void;
};

export function useAutoSaveForm<TFormValues extends Record<string, any>>(
  form: UseFormReturn<TFormValues>,
  options: AutoSaveOptions
) {
  const { formId, idleTime = 120000, enabled = true, onSave } = options;
  // eslint-disable-next-line no-undef
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `form-autosave-${formId}`;

  const saveFormData = () => {
    if (!enabled || !form.formState.isDirty) return;
    const formData = form.getValues();
    localStorage.setItem(storageKey, JSON.stringify(formData));

    if (onSave) {
      onSave(formData);
    }
  };

  const loadSavedData = (): TFormValues | null => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        return null;
      }
    }
    return null;
  };

  const clearSavedData = () => {
    localStorage.removeItem(storageKey);
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (enabled) {
      timerRef.current = setTimeout(() => {
        saveFormData();
      }, idleTime);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [enabled, idleTime]);

  useEffect(() => {
    const savedData = loadSavedData();
    if (savedData && enabled) {
      Object.entries(savedData).forEach(([key, value]) =>
        form.setValue(key as Path<TFormValues>, value, {
          shouldDirty: true,
        })
      );
      clearSavedData();
    }
  }, []);

  return {
    loadSavedData,
    clearSavedData,
    saveFormData,
  };
}
