"use client";

import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item != null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sync across tabs via native storage event
  useEffect(() => {
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
  }, [key, initialValue]);

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
