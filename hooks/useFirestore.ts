import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ── useDocument — real-time single doc ────────────────────────────
export function useDocument<T>(
  collectionName: string,
  id: string | null | undefined
) {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, collectionName, id),
      (snap) => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`useDocument error (${collectionName}/${id}):`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, id]);

  return { data, loading, error };
}

// ── useCollection — real-time collection ──────────────────────────
export function useCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data,    setData]    = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`useCollection error (${collectionName}):`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error };
}

// ── usePagination — paginated collection ──────────────────────────
export function usePagination<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  pageSize = 10
) {
  const [data,     setData]     = useState<T[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [hasMore,  setHasMore]  = useState(true);
  const [lastDoc,  setLastDoc]  = useState<DocumentData | null>(null);

  const loadMore = useCallback(async () => {
    // Implementation with startAfter when needed
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName), ...constraints);
    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.slice(0, pageSize).map((d) => ({ id: d.id, ...d.data() } as T));
      setData(docs);
      setHasMore(snap.docs.length > pageSize);
      if (snap.docs.length > 0) setLastDoc(snap.docs[snap.docs.length - 1]);
      setLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, pageSize]);

  return { data, loading, hasMore, loadMore };
}

// ── useMutation — create/update/delete with loading state ─────────
export function useMutation() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(async (fn: () => Promise<unknown>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await fn();
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "কিছু একটা ভুল হয়েছে।";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { mutate, loading, error, success, reset };
}
