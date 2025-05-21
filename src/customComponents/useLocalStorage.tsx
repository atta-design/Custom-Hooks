import { useState, useEffect } from "react";

/**
 * A custom hook to sync state with localStorage.
 *
 * @param key - The key in localStorage
 * @param initialValue - The default value if no existing item is found
 * @returns [value, setValue] - A stateful value and a setter
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn("Failed to write to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
