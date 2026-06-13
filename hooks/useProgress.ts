import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import {
  getUserProgress,
  markTopicComplete,
  updateLastVisited,
  getUserBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "@/lib/firestore";
import { Progress, Bookmark } from "@/types";

// ── useProgress — track topic completion ──────────────────────────
export function useProgress() {
  const { user } = useAuth();
  const [progress,       setProgress]       = useState<Progress[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!user) { setProgress([]); return; }

    setLoading(true);
    getUserProgress(user.uid).then((data) => {
      setProgress(data);
      setCompletedCount(data.filter((p) => p.completed).length);
      setLoading(false);
    });
  }, [user]);

  const isCompleted = useCallback(
    (topicId: string) => progress.some((p) => p.topicId === topicId && p.completed),
    [progress]
  );

  const markComplete = useCallback(
    async (topicId: string) => {
      if (!user) return false;
      const ok = await markTopicComplete(user.uid, topicId);
      if (ok) {
        setProgress((prev) => {
          const exists = prev.find((p) => p.topicId === topicId);
          if (exists) return prev.map((p) => p.topicId === topicId ? { ...p, completed: true } : p);
          return [...prev, { userId: user.uid, topicId, completed: true, lastVisited: new Date() }];
        });
        setCompletedCount((c) => c + 1);
      }
      return ok;
    },
    [user]
  );

  const trackVisit = useCallback(
    async (topicId: string) => {
      if (!user) return;
      await updateLastVisited(user.uid, topicId);
    },
    [user]
  );

  const getProgressPercentage = useCallback(
    (totalTopics: number) => {
      if (totalTopics === 0) return 0;
      return Math.round((completedCount / totalTopics) * 100);
    },
    [completedCount]
  );

  return {
    progress,
    loading,
    completedCount,
    isCompleted,
    markComplete,
    trackVisit,
    getProgressPercentage,
  };
}

// ── useBookmarks — bookmark any content ───────────────────────────
export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (!user) { setBookmarks([]); return; }
    setLoading(true);
    getUserBookmarks(user.uid).then((data) => {
      setBookmarks(data);
      setLoading(false);
    });
  }, [user]);

  const checkBookmark = useCallback(
    async (refType: Bookmark["refType"], refId: string): Promise<boolean> => {
      if (!user) return false;
      return isBookmarked(user.uid, refType, refId);
    },
    [user]
  );

  const toggle = useCallback(
    async (refType: Bookmark["refType"], refId: string): Promise<boolean> => {
      if (!user) return false;

      const alreadyBookmarked = bookmarks.some(
        (b) => b.refType === refType && b.refId === refId
      );

      if (alreadyBookmarked) {
        const ok = await removeBookmark(user.uid, refType, refId);
        if (ok) {
          setBookmarks((prev) =>
            prev.filter((b) => !(b.refType === refType && b.refId === refId))
          );
        }
        return !ok; // returns new state (false = not bookmarked)
      } else {
        const ok = await addBookmark(user.uid, refType, refId);
        if (ok) {
          setBookmarks((prev) => [
            ...prev,
            { userId: user.uid, refType, refId, createdAt: new Date() },
          ]);
        }
        return ok; // returns new state (true = bookmarked)
      }
    },
    [user, bookmarks]
  );

  const isItemBookmarked = useCallback(
    (refType: Bookmark["refType"], refId: string) =>
      bookmarks.some((b) => b.refType === refType && b.refId === refId),
    [bookmarks]
  );

  const getByType = useCallback(
    (refType: Bookmark["refType"]) => bookmarks.filter((b) => b.refType === refType),
    [bookmarks]
  );

  return {
    bookmarks,
    loading,
    toggle,
    isItemBookmarked,
    checkBookmark,
    getByType,
    count: bookmarks.length,
  };
}

// ── useTopicProgress — per-topic progress with bookmark ───────────
export function useTopicProgress(topicId: string) {
  const { user }                         = useAuth();
  const { isCompleted, markComplete }    = useProgress();
  const { isItemBookmarked, toggle }     = useBookmarks();
  const [completing, setCompleting]      = useState(false);
  const [bookmarking, setBookmarking]    = useState(false);

  const completed   = isCompleted(topicId);
  const bookmarked  = isItemBookmarked("formula", topicId);

  const handleMarkComplete = async () => {
    if (!user || completing) return;
    setCompleting(true);
    await markComplete(topicId);
    setCompleting(false);
  };

  const handleToggleBookmark = async () => {
    if (!user || bookmarking) return;
    setBookmarking(true);
    await toggle("formula", topicId);
    setBookmarking(false);
  };

  return {
    completed,
    bookmarked,
    completing,
    bookmarking,
    handleMarkComplete,
    handleToggleBookmark,
    isLoggedIn: !!user,
  };
}
