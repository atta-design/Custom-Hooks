import { useState, useEffect, useRef, useCallback } from "react";

interface UseFetchOptions {
  retries?: number;
  retryDelay?: number; 
  cache?: boolean;
}

interface FetchState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const cacheStore = new Map<string, any>();

export function useFetch<T = unknown>(
  url: string,
  options?: RequestInit,
  config: UseFetchOptions = {}
): FetchState<T> {
  const { retries = 0, retryDelay = 1000, cache = false } = config;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (cache && cacheStore.has(url)) {
      setData(cacheStore.get(url));
      setLoading(false);
      return;
    }

    let attempt = 0;
    while (attempt <= retries) {
      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      try {
        const response = await fetch(url, { ...options, signal });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const result: T = await response.json();
        setData(result);
        if (cache) cacheStore.set(url, result);
        break; // success
      } catch (err: any) {
        if (signal.aborted) {
          setError("Fetch aborted");
          break;
        }

        if (attempt === retries) {
          setError(err.message || "Unknown error");
        } else {
          await new Promise((res) => setTimeout(res, retryDelay));
        }
      } finally {
        setLoading(false);
      }

      attempt++;
    }
  }, [url, options, retries, retryDelay, cache]);

  useEffect(() => {
    fetchData();

    return () => {
      controllerRef.current?.abort();
    };
  }, [fetchData]);

  return { data, error, loading };
}
