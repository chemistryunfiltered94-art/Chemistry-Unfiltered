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
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Topic, Formula, Reaction, Article, MCQ, Progress, Bookmark, User, Chapter, StudyNote, NoteType, RevisionLevel, RevisionQuestion, Achievement } from "@/types";
import { updateStreak, checkNewAchievements, todayLocalDate, XP_REWARDS } from "./gamification";

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

/** ইউজারের progress ডকুমেন্টগুলোর lastVisited থেকে "YYYY-MM-DD" → সেদিন কতগুলো
 *  টপিক ভিজিট/সম্পন্ন হয়েছে তার count বানায় — dashboard-এর activity heatmap-এর জন্য।
 *  আলাদা কোনো activityLog কালেকশন নেই, তাই progress-ই একমাত্র সত্যিকারের সোর্স। */
export async function getUserActivityLog(
  userId: string,
  weeks: number = 52
): Promise<Record<string, number>> {
  try {
    const progress = await getDocuments<Progress>("progress", [where("userId", "==", userId)]);
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - weeks * 7);

    const log: Record<string, number> = {};
    for (const p of progress) {
      if (!p.lastVisited) continue;
      // Firestore Timestamp হলে .toDate() লাগবে, ইতিমধ্যে Date/string হলে সরাসরি ব্যবহার করা যাবে।
      const raw = p.lastVisited as unknown;
      const date =
        raw && typeof raw === "object" && "toDate" in (raw as { toDate?: () => Date })
          ? (raw as { toDate: () => Date }).toDate()
          : new Date(raw as string | number | Date);
      if (isNaN(date.getTime()) || date < cutoff) continue;
      const key = date.toISOString().slice(0, 10);
      log[key] = (log[key] || 0) + 1;
    }
    return log;
  } catch (error) {
    console.error("Error getting user activity log:", error);
    return {};
  }
}

/** টপিক সম্পন্ন করা: progress ডকুমেন্ট merge করে, তারপর ইতিমধ্যে completed
 *  না থাকলে (প্রথমবার সম্পন্ন হলে) XP/streak/achievement হালনাগাদ করে।
 *  আগে থেকে completed থাকা টপিক আবার মার্ক করলে ডুপ্লিকেট XP পাওয়া উচিত না,
 *  তাই সেই কেসে গ্যামিফিকেশন অংশ স্কিপ করা হয়। */
export async function markTopicComplete(
  userId: string,
  topicId: string
): Promise<{ success: boolean; newAchievements: Achievement[] }> {
  const progressId = `${userId}_${topicId}`;
  try {
    const existingSnap = await getDoc(doc(db, "progress", progressId));
    const alreadyCompleted = existingSnap.exists() && existingSnap.data()?.completed === true;

    await setDoc(
      doc(db, "progress", progressId),
      { userId, topicId, completed: true, lastVisited: serverTimestamp() },
      { merge: true }
    );

    if (alreadyCompleted) {
      return { success: true, newAchievements: [] };
    }

    // ── গ্যামিফিকেশন: XP + streak + achievement (শুধু নতুন completion-এ) ──
    const userSnap = await getDoc(doc(db, "users", userId));
    const userData = (userSnap.exists() ? userSnap.data() : {}) as Partial<User>;

    const { streak, isNewDay } = updateStreak(userData.streak, userData.lastActivityDate);
    const xpGain = XP_REWARDS.TOPIC_COMPLETE + (isNewDay ? XP_REWARDS.DAILY_FIRST_VISIT : 0);
    const newXp = (userData.xp || 0) + xpGain;

    const allProgress = await getUserProgress(userId);
    // এইমাত্র merge করা ডকুমেন্টটা getUserProgress-এর snapshot-এ নাও থাকতে পারে
    // (read-after-write consistency এর কারণে), তাই এই টপিকটাও গণনায় ধরে নিশ্চিত করি।
    const completedTopicIds = new Set(
      allProgress.filter((p) => p.completed).map((p) => p.topicId)
    );
    completedTopicIds.add(topicId);

    const alreadyUnlocked = userData.unlockedAchievements || [];
    const newAchievements = checkNewAchievements({
      totalXp: newXp,
      streak,
      completedTopicsCount: completedTopicIds.size,
      alreadyUnlocked,
    });

    await setDoc(
      doc(db, "users", userId),
      {
        xp: newXp,
        streak,
        lastActivityDate: todayLocalDate(),
        unlockedAchievements: [
          ...alreadyUnlocked,
          ...newAchievements.map((a) => a.id),
        ],
      },
      { merge: true }
    );

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

// ─── Revision (Board Question Bank) ────────────────────────────────

/** এই level-এ প্রকাশিত প্রশ্ন থেকে ডুপ্লিকেট-মুক্ত বিষয়ের তালিকা, বর্ণমালা অনুযায়ী সাজানো। */
export async function getRevisionSubjects(level: RevisionLevel): Promise<string[]> {
  const questions = await getDocuments<RevisionQuestion>("revisionQuestions", [
    where("level", "==", level),
    where("published", "==", true),
  ]);
  return Array.from(new Set(questions.map((q) => q.subject))).sort();
}

/** এই level + subject-এ প্রকাশিত প্রশ্ন থেকে ডুপ্লিকেট-মুক্ত সালের তালিকা, নতুন থেকে পুরনো। */
export async function getRevisionYears(level: RevisionLevel, subject: string): Promise<string[]> {
  const questions = await getDocuments<RevisionQuestion>("revisionQuestions", [
    where("level", "==", level),
    where("subject", "==", subject),
    where("published", "==", true),
  ]);
  return Array.from(new Set(questions.map((q) => q.year))).sort().reverse();
}

/** এই level + subject + year-এর সব প্রকাশিত প্রশ্ন। */
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

/** একটা নির্দিষ্ট রিভিশন প্রশ্ন id দিয়ে — published/draft নির্বিশেষে (caller published চেক করে,
 *  যেমন admin preview-তে draft দেখানোর দরকার হতে পারে)। */
export async function getRevisionQuestion(id: string): Promise<RevisionQuestion | null> {
  return getDocument<RevisionQuestion>("revisionQuestions", id);
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
  try {
    const [users, topics, questions, articles] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(query(collection(db, "topics"), where("published", "==", true))),
      getDocs(collection(db, "questions")),
      getDocs(query(collection(db, "articles"), where("published", "==", true))),
    ]);
    return {
      users:     users.size,
      topics:    topics.size,
      questions: questions.size,
      articles:  articles.size,
    };
  } catch {
    return { users: 0, topics: 0, questions: 0, articles: 0 };
  }
}
