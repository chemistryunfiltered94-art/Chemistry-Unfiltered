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
import { Topic, Formula, Reaction, Article, MCQ, Progress, Bookmark, User, Chapter, StudyNote, NoteType, UserActivity, Achievement } from "@/types";
import { XP_REWARDS, updateStreak, todayLocalDate, checkNewAchievements } from "./gamification";

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

/**
 * টপিক সম্পন্ন চিহ্নিত করে, এবং সাথে গ্যামিফিকেশন হালনাগাদ করে:
 *  - প্রথমবার সম্পন্ন হলে +XP_REWARDS.TOPIC_COMPLETE (আগে থেকেই completed
 *    থাকলে দ্বিতীয়বার XP দেওয়া হয় না — নিচের progressSnap চেক দ্রষ্টব্য)
 *  - দৈনিক প্রথম অ্যাক্টিভিটি হলে streak +১ ও দৈনিক bonus XP
 *  - নতুন কোনো achievement unlock-যোগ্য হলে সেটাও দেওয়া হয়
 *
 * রিটার্ন করে { success, newAchievements } — success আগের boolean রিটার্নের
 * জায়গায় (hooks/useProgress.ts এ ok হিসেবে ব্যবহৃত), newAchievements
 * ভবিষ্যতে UI celebration/toast এর জন্য ব্যবহারযোগ্য।
 */
export async function markTopicComplete(
  userId: string,
  topicId: string
): Promise<{ success: boolean; newAchievements: Achievement[] }> {
  const progressId = `${userId}_${topicId}`;
  try {
    // ইতিমধ্যে সম্পন্ন কিনা দেখে নিই — দ্বিতীয়বার একই টপিক "সম্পন্ন" করলে
    // যেন duplicate XP না পায়।
    const progressSnap = await getDoc(doc(db, "progress", progressId));
    const alreadyCompleted = progressSnap.exists() && progressSnap.data()?.completed === true;

    await setDoc(
      doc(db, "progress", progressId),
      { userId, topicId, completed: true, lastVisited: serverTimestamp() },
      { merge: true }
    );

    // গ্যামিফিকেশন হালনাগাদ (টপিক প্রথমবার সম্পন্ন হলে + সবসময় দৈনিক activity)
    let newAchievements: Achievement[] = [];
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = (userSnap.data() as Partial<User>) || {};

      const { streak, isNewDay } = updateStreak(userData.streak, userData.lastActivityDate);

      let xpGain = 0;
      if (!alreadyCompleted) xpGain += XP_REWARDS.TOPIC_COMPLETE;
      if (isNewDay) xpGain += XP_REWARDS.DAILY_FIRST_VISIT;

      const newTotalXp = (userData.xp || 0) + xpGain;

      // completedTopicsCount বের করার জন্য আপডেটেড progress লিস্ট লাগবে
      const allProgress = await getUserProgress(userId);
      const completedTopicsCount = allProgress.filter((p) => p.completed).length;

      newAchievements = checkNewAchievements({
        totalXp: newTotalXp,
        streak,
        completedTopicsCount,
        alreadyUnlocked: userData.unlockedAchievements || [],
      });
      const achievementXp = newAchievements.reduce((sum, a) => sum + a.xpReward, 0);

      await setDoc(
        userRef,
        {
          xp: newTotalXp + achievementXp,
          streak,
          lastActivityDate: todayLocalDate(),
          unlockedAchievements: [
            ...(userData.unlockedAchievements || []),
            ...newAchievements.map((a) => a.id),
          ],
        },
        { merge: true }
      );

      if (isNewDay) {
        await recordDailyActivity(userId);
      }
    } catch (gamificationError) {
      // গ্যামিফিকেশন হালনাগাদ ব্যর্থ হলেও মূল progress সেভ যেন আটকে না যায়
      console.error("Error updating gamification stats:", gamificationError);
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

// ─── Gamification: Daily Activity (heatmap-এর ডেটা) ────────────────

/**
 * আজকের জন্য userActivity ডকুমেন্ট create/increment করে। ডক আইডি
 * "{userId}_{YYYY-MM-DD}" — একই দিনে বারবার কল হলেও duplicate ডক না হয়ে
 * count বাড়ে (increment ব্যবহার করে atomic)।
 */
export async function recordDailyActivity(userId: string): Promise<void> {
  const date = todayLocalDate();
  const id = `${userId}_${date}`;
  try {
    await setDoc(
      doc(db, "userActivity", id),
      { userId, date, count: increment(1) },
      { merge: true }
    );
  } catch (error) {
    console.error("Error recording daily activity:", error);
  }
}

/**
 * গত `weeks` সপ্তাহের অ্যাক্টিভিটি লগ আনে (ডিফল্ট ৫২ সপ্তাহ — heatmap-এর জন্য)।
 * ফলাফল "YYYY-MM-DD" → count ম্যাপ, যাতে UI-তে সরাসরি lookup করা যায়।
 */
export async function getUserActivityLog(
  userId: string,
  weeks: number = 52
): Promise<Record<string, number>> {
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);
  const sinceStr = since.toISOString().slice(0, 10);

  const entries = await getDocuments<UserActivity>("userActivity", [
    where("userId", "==", userId),
    where("date", ">=", sinceStr),
  ]);

  const map: Record<string, number> = {};
  for (const e of entries) map[e.date] = e.count;
  return map;
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
