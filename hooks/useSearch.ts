import { useState, useEffect, useCallback, useRef } from "react";

// ── useDebounce ────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ── useSearch — local array search ────────────────────────────────
export function useSearch<T extends Record<string, unknown>>(
  data: T[],
  searchFields: (keyof T)[],
  options?: { minLength?: number }
) {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<T[]>(data);

  const debouncedQuery = useDebounce(query, 250);
  const minLength = options?.minLength ?? 1;

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < minLength) {
      setResults(data);
      return;
    }

    const q = debouncedQuery.toLowerCase();
    const filtered = data.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        if (typeof val === "string") return val.toLowerCase().includes(q);
        if (typeof val === "number") return String(val).includes(q);
        return false;
      })
    );
    setResults(filtered);
  }, [debouncedQuery, data, searchFields, minLength]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults(data);
  }, [data]);

  return { query, setQuery, results, clearSearch };
}

// ── useSearchModal — global Cmd+K shortcut ─────────────────────────
export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}

// ── useFilter — multi-category filter ─────────────────────────────
export function useFilter<T extends Record<string, unknown>>(
  data: T[],
  filterKey: keyof T,
  allValue = "all"
) {
  const [activeFilter, setActiveFilter] = useState(allValue);

  const filtered = activeFilter === allValue
    ? data
    : data.filter((item) => item[filterKey] === activeFilter);

  const setFilter = useCallback((value: string) => {
    setActiveFilter(value);
  }, []);

  const resetFilter = useCallback(() => {
    setActiveFilter(allValue);
  }, [allValue]);

  return { filtered, activeFilter, setFilter, resetFilter };
}
