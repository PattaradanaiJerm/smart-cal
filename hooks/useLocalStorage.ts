"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

const STORAGE_EVENT = "sc_storage_change";

// Module-level subscribe — stable reference, no re-subscription on re-render
function subscribe(callback: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, callback);
  return () => window.removeEventListener(STORAGE_EVENT, callback);
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);

  const getSnapshot = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item != null ? (JSON.parse(item) as T) : initialRef.current;
    } catch {
      return initialRef.current;
    }
  }, [key]);

  // Server and first-client render BOTH return initialValue → no hydration mismatch
  const getServerSnapshot = useCallback((): T => initialRef.current, []);

  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const raw = window.localStorage.getItem(key);
        const current: T = raw != null ? JSON.parse(raw) : initialRef.current;
        const next = typeof value === "function" ? (value as (prev: T) => T)(current) : value;
        window.localStorage.setItem(key, JSON.stringify(next));
        // Notify all useSyncExternalStore subscribers in this tab
        window.dispatchEvent(new Event(STORAGE_EVENT));
      } catch {
        // ignore (e.g. incognito quota exceeded)
      }
    },
    [key]
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      // ignore
    }
  }, [key]);

  return { value: stored, setValue, reset } as const;
}
