import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  DocumentSnapshot,
  QueryConstraint,
  Query,
  DocumentData,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Topic, Formula, Reaction, Article, MCQ, Progress, Bookmark, User, Chapter, StudyNote, NoteType, RevisionQuestion, RevisionLevel, Achievement } from "@/types";
import { checkNewAchievements, XP_REWARDS } from "./gamification";

// ─── Generic Helpers ───────────────────────────────────────────────

export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const snap = await getDoc(doc(db, collectionName, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  } catch (error) {
    console.error(`Error getting ${collectionName}/${id}:`, error);
    return null;
  }
}

export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    return [];
  }
}

export async function createDocument(
  collectionName: string,
  data: Record<string, unknown>,
  id?: string
): Promise<string | null> {
  try {
    const payload = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    if (id) {
      await setDoc(doc(db, collectionName, id), payload);
      return id;
    }
    const ref = await addDoc(collection(db, collectionName), payload);
    return ref.id;
  } catch (error) {
    console.error(`Error creating ${collectionName}:`, error);
    return null;
  }
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating ${collectionName}/${id}:`, error);
    return false;
  }
}

export async function deleteDocument(collectionName: string, id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error(`Error deleting ${collectionName}/${id}:`, error);
    return false;
  }
}

// ─── Chapters ──────────────────────────────────────────────────────

export async function getChapters(categoryId: string): Promise<Chapter[]> {
  return getDocuments<Chapter>("chapters", [
    where("categoryId", "==", categoryId),
    orderBy("order", "asc"),
  ]);
}

export async function getChapter(id: string): Promise<Chapter | null> {
  return getDocument<Chapter>("chapters", id);
}

export async function createChapter(data: {
  title: string;
  categoryId: string;
  order: number;
  description?: string;
}): Promise<string | null> {
  return createDocument("chapters", data);
}

// ─── Topics ────────────────────────────────────────────────────────

export async function getTopics(options?: {
  categoryId?: string;
  chapterId?: string;
  featured?: boolean;
  limitCount?: number;
}): Promise<Topic[]> {
  const constraints: QueryConstraint[] = [where("published", "==", true)];
  if (options?.categoryId) constraints.push(where("categoryId", "==", options.categoryId));
  if (options?.chapterId)  constraints.push(where("chapterId",  "==", options.chapterId));
  if (options?.featured)   constraints.push(where("featured",   "==", true));
  constraints.push(orderBy("createdAt", "asc"));
  if (options?.limitCount) constraints.push(limit(options.limitCount));
  return getDocuments<Topic>("topics", constraints);
}

export async function getTopic(slug: string): Promise<Topic | null> {
  const topics = await getDocuments<Topic>("topics", [where("slug", "==", slug), limit(1)]);
  return topics[0] || null;
}

/** Admin-only: সব টপিক (প্রকাশিত ও অপ্রকাশিত draft সহ) — Chapter Manager-এ
 *  প্রতি অধ্যায়ে সঠিক টপিক-সংখ্যা দেখানোর জন্য ব্যবহৃত হয়। */
export async function getAllTopicsByCategory(categoryId: string): Promise<Topic[]> {
  return getDocuments<Topic>("topics", [where("categoryId", "==", categoryId)]);
}

export async function incrementTopicViews(id: string): Promise<void> {
  try {
    await updateDoc(doc(db, "topics", id), { views: increment(1) });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

// ─── Formulas ──────────────────────────────────────────────────────

export async function getFormulas(category?: string): Promise<Formula[]> {
  const constraints: QueryConstraint[] = [];
  if (category && category !== "all") {
    constraints.push(where("category", "==", category));
  }
  constraints.push(orderBy("name", "asc"));
  return getDocuments<Formula>("formulas", constraints);
}

export async function getFormula(id: string): Promise<Formula | null> {
  return getDocument<Formula>("formulas", id);
}

// ─── Reactions ─────────────────────────────────────────────────────

export async function getReactions(category?: string): Promise<Reaction[]> {
  const constraints: QueryConstraint[] = [];
  if (category && category !== "all") {
    constraints.push(where("category", "==", category));
  }
  return getDocuments<Reaction>("reactions", constraints);
}

// ─── Articles ──────────────────────────────────────────────────────

export async function getArticles(options?: {
  limitCount?: number;
  tag?: string;
}): Promise<Article[]> {
  const constraints: QueryConstraint[] = [where("published", "==", true)];
  if (options?.tag) constraints.push(where("tags", "array-contains", options.tag));
  constraints.push(orderBy("createdAt", "desc"));
  if (options?.limitCount) constraints.push(limit(options.limitCount));
  return getDocuments<Article>("articles", constraints);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const articles = await getDocuments<Article>("articles", [
    where("slug", "==", slug),
    where("published", "==", true),
    limit(1),
  ]);
  return articles[0] || null;
}

// ─── Study Notes (Notes Center: Class / Revision / Practical / Formula sheet) ──

export async function getStudyNotes(options?: {
  type?: NoteType | "all";
  limitCount?: number;
}): Promise<StudyNote[]> {
  const constraints: QueryConstraint[] = [where("published", "==", true)];
  if (options?.type && options.type !== "all") {
    constraints.push(where("type", "==", options.type));
  }
  constraints.push(orderBy("createdAt", "desc"));
  if (options?.limitCount) constraints.push(limit(options.limitCount));
  return getDocuments<StudyNote>("studyNotes", constraints);
}

export async function getStudyNote(slug: string): Promise<StudyNote | null> {
  const notes = await getDocuments<StudyNote>("studyNotes", [
    where("slug", "==", slug),
    where("published", "==", true),
    limit(1),
  ]);
  return notes[0] || null;
}

// ─── Revision (উচ্চ মাধ্যমিক / অনার্স — Subject → Year → Q&A) ──────

/** নির্দিষ্ট level-এর সব বিষয়ের নাম (ডুপ্লিকেট বাদে), Firestore-এ যা আছে তা থেকেই বের করা হয় —
 *  আলাদা করে "subjects" কালেকশন রাখার দরকার নেই। */
export async function getRevisionSubjects(level: RevisionLevel): Promise<string[]> {
  const all = await getDocuments<RevisionQuestion>("revisionQuestions", [
    where("level", "==", level),
    where("published", "==", true),
  ]);
  return Array.from(new Set(all.map((q) => q.subject))).sort();
}

/** নির্দিষ্ট level + subject-এর সব সাল (ডুপ্লিকেট বাদে)। */
export async function getRevisionYears(level: RevisionLevel, subject: string): Promise<string[]> {
  const all = await getDocuments<RevisionQuestion>("revisionQuestions", [
    where("level", "==", level),
    where("subject", "==", subject),
    where("published", "==", true),
  ]);
  return Array.from(new Set(all.map((q) => q.year))).sort().reverse();
}

/** নির্দিষ্ট level + subject + year-এর সব প্রশ্ন। */
export async function getRevisionQuestions(
  level: RevisionLevel,
  subject: string,
  year: string
): Promise<RevisionQuestion[]> {
  return getDocuments<RevisionQuestion>("revisionQuestions", [
    where("level", "==", level),
    where("subject", "==", subject),
    where("year", "==", year),
    where("published", "==", true),
  ]);
}

export async function getRevisionQuestion(id: string): Promise<RevisionQuestion | null> {
  return getDocument<RevisionQuestion>("revisionQuestions", id);
}

/** Admin-only: সব revision প্রশ্ন (draft সহ) — admin listing/manage পেজের জন্য। */
export async function getAllRevisionQuestions(): Promise<RevisionQuestion[]> {
  return getDocuments<RevisionQuestion>("revisionQuestions", []);
}

// ─── Questions / MCQ ───────────────────────────────────────────────

export async function getQuestions(options?: {
  exam?: string;
  categoryId?: string;
  topicId?: string;
  difficulty?: string;
  limitCount?: number;
}): Promise<MCQ[]> {
  const constraints: QueryConstraint[] = [];
  if (options?.exam && options.exam !== "সব") {
    constraints.push(where("exam", "array-contains", options.exam));
  }
  if (options?.categoryId) constraints.push(where("categoryId", "==", options.categoryId));
  if (options?.topicId)    constraints.push(where("topicId",    "==", options.topicId));
  if (options?.difficulty && options.difficulty !== "সব") {
    constraints.push(where("difficulty", "==", options.difficulty));
  }
  if (options?.limitCount) constraints.push(limit(options.limitCount));
  return getDocuments<MCQ>("questions", constraints);
}

// ─── User Progress ─────────────────────────────────────────────────

export async function getUserProgress(userId: string): Promise<Progress[]> {
  return getDocuments<Progress>("progress", [where("userId", "==", userId)]);
}

/**
 * টপিক সম্পন্ন হিসেবে মার্ক করে, তারপর নতুন কোনো achievement unlock হলো কিনা
 * চেক করে (lib/gamification.ts-এর checkNewAchievements দিয়ে) এবং হলে
 * user ডকুমেন্টে xp/unlockedAchievements আপডেট করে। streak এখানে বদলানো
 * হয় না — সেটা আলাদা "daily visit" লজিকের অংশ (updateLastVisited-এর
 * caller-এর দায়িত্ব), শুধু completed-topic-count-ভিত্তিক achievement-ই
 * এখানে ধরা হয়েছে।
 */
export async function markTopicComplete(
  userId: string,
  topicId: string
): Promise<{ success: boolean; newAchievements: Achievement[] }> {
  const id = `${userId}_${topicId}`;
  try {
    await setDoc(
      doc(db, "progress", id),
      { userId, topicId, completed: true, lastVisited: serverTimestamp() },
      { merge: true }
    );

    const [user, allProgress] = await Promise.all([
      getUser(userId),
      getUserProgress(userId),
    ]);

    if (!user) return { success: true, newAchievements: [] };

    const completedTopicsCount = allProgress.filter((p) => p.completed).length;
    const alreadyUnlocked = user.unlockedAchievements || [];

    const newAchievements = checkNewAchievements({
      totalXp: user.xp || 0,
      streak: user.streak || 0,
      completedTopicsCount,
      alreadyUnlocked,
    });

    const earnedXp = XP_REWARDS.TOPIC_COMPLETE + newAchievements.reduce((sum, a) => sum + a.xpReward, 0);

    if (earnedXp > 0 || newAchievements.length > 0) {
      await updateUser(userId, {
        xp: (user.xp || 0) + earnedXp,
        unlockedAchievements: [...alreadyUnlocked, ...newAchievements.map((a) => a.id)],
      });
    }

    return { success: true, newAchievements };
  } catch (error) {
    console.error("Error marking topic complete:", error);
    return { success: false, newAchievements: [] };
  }
}

export async function updateLastVisited(userId: string, topicId: string): Promise<void> {
  const id = `${userId}_${topicId}`;
  try {
    await setDoc(
      doc(db, "progress", id),
      { userId, topicId, lastVisited: serverTimestamp() },
      { merge: true }
    );
  } catch {
    // silent fail
  }
}

/**
 * ব্যবহারকারীর গত `weeks` সপ্তাহের activity heatmap বানায় — user-এর "progress"
 * ডকুমেন্টগুলো থেকে lastVisited তারিখ অনুযায়ী গণনা করে "YYYY-MM-DD" → count
 * ম্যাপ রিটার্ন করে (dashboard-এর গ্যামিফিকেশন heatmap-এর জন্য ব্যবহৃত)।
 *
 * lastVisited Firestore-এ Timestamp হিসেবে থাকে, plain Date না — তাই
 * lib/utils.ts-এর formatFirestoreDate-এর মতোই duck-typing দিয়ে `.toDate()`
 * চেক করা হয়েছে।
 */
export async function getUserActivityLog(
  userId: string,
  weeks: number = 52
): Promise<Record<string, number>> {
  const log: Record<string, number> = {};
  try {
    const since = new Date();
    since.setDate(since.getDate() - weeks * 7);

    const progress = await getDocuments<Progress & { lastVisited: unknown }>("progress", [
      where("userId", "==", userId),
    ]);

    for (const entry of progress) {
      const raw = entry.lastVisited;
      let date: Date | null = null;

      if (raw && typeof raw === "object" && "toDate" in raw) {
        date = (raw as { toDate: () => Date }).toDate();
      } else if (raw instanceof Date) {
        date = raw;
      } else if (typeof raw === "string" || typeof raw === "number") {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) date = d;
      }

      if (!date || date < since) continue;

      const key = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
      log[key] = (log[key] || 0) + 1;
    }

    return log;
  } catch (error) {
    console.error("Error getting user activity log:", error);
    return log;
  }
}

// ─── Bookmarks ─────────────────────────────────────────────────────

export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
  return getDocuments<Bookmark>("bookmarks", [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  ]);
}

export async function addBookmark(
  userId: string,
  refType: Bookmark["refType"],
  refId: string
): Promise<boolean> {
  const id = `${userId}_${refType}_${refId}`;
  try {
    await setDoc(doc(db, "bookmarks", id), {
      userId, refType, refId,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return false;
  }
}

export async function removeBookmark(
  userId: string,
  refType: Bookmark["refType"],
  refId: string
): Promise<boolean> {
  const id = `${userId}_${refType}_${refId}`;
  return deleteDocument("bookmarks", id);
}

export async function isBookmarked(
  userId: string,
  refType: Bookmark["refType"],
  refId: string
): Promise<boolean> {
  const id = `${userId}_${refType}_${refId}`;
  const snap = await getDoc(doc(db, "bookmarks", id));
  return snap.exists();
}

// ─── Users ─────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<User | null> {
  return getDocument<User>("users", uid);
}

export async function updateUser(uid: string, data: Partial<User>): Promise<boolean> {
  return updateDocument("users", uid, data as Record<string, unknown>);
}

export async function getAllUsers(): Promise<User[]> {
  return getDocuments<User>("users", [orderBy("createdAt", "desc")]);
}

// ─── Admin helpers ─────────────────────────────────────────────────

export async function getSiteStats(): Promise<{
  users: number;
  topics: number;
  questions: number;
  articles: number;
}> {
  // ⚠️ firestore.rules অনুযায়ী /users/{userId} শুধু owner/admin read করতে
  // পারে — non-admin ইউজারের জন্য getDocs(collection(db,"users")) সবসময়
  // permission-denied দেবে। আগে এই পুরো ফাংশন Promise.all-এ ছিল, ফলে
  // users query ফেইল করলে topics/questions/articles-এর ঠিকঠাক গণনাও
  // catch-এ পড়ে সব ০ হয়ে যেত। এখন প্রতিটা query আলাদাভাবে try/catch
  // করা হচ্ছে, যাতে একটার ব্যর্থতা বাকিগুলোর সঠিক সংখ্যা নষ্ট না করে।
  // "users" এর জন্য non-admin ইউজার সবসময় ০ পাবে (rules দিয়ে ইচ্ছাকৃত) —
  // caller (dashboard) admin না হলে এই ফিল্ডটা UI-তে না দেখানো উচিত।
  async function safeCount(q: Query<DocumentData>) {
    try {
      return (await getDocs(q)).size;
    } catch {
      return 0;
    }
  }

  const [users, topics, questions, articles] = await Promise.all([
    safeCount(collection(db, "users")),
    safeCount(query(collection(db, "topics"), where("published", "==", true))),
    safeCount(collection(db, "questions")),
    safeCount(query(collection(db, "articles"), where("published", "==", true))),
  ]);

  return { users, topics, questions, articles };
}
