"use client";

import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Always start with initialValue so SSR and first client render match (no hydration mismatch)
  const [stored, setStored] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage only after mount (client-only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item != null) setStored(JSON.parse(item) as T);
    } catch {
      // ignore
    }
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Sync across tabs via native storage event
  useEffect(() => {
    if (!hydrated) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setStored(e.newValue != null ? JSON.parse(e.newValue) : initialValue);
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue, hydrated]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore quota errors
        }
        return next;
      });
    },
    [key]
  );

  const reset = useCallback(() => {
    setStored(initialValue);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  return { value: stored, setValue, reset } as const;
}
