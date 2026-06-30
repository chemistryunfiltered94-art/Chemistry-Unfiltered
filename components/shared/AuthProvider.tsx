"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { onAuthStateChanged, getRedirectResult, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  isAdmin: false,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserDoc = useCallback(async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser({ uid, ...userDoc.data() } as User);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  // প্রোফাইল নাম/ছবি পরিবর্তনের পর Navbar ও অন্যান্য জায়গায় তা সাথে সাথে
  // দেখানোর জন্য — onAuthStateChanged শুধু auth অবস্থা বদলালে চলে, Firestore
  // ডকুমেন্ট আপডেটে নয়, তাই ম্যানুয়ালি রিফ্রেশ করার উপায় দরকার।
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    await fetchUserDoc(auth.currentUser.uid);
  }, [fetchUserDoc]);

  useEffect(() => {
    // Picks up the result after signInWithRedirect() sends the browser to
    // Google and back. Also makes sure a Google sign-in (which has no
    // email/password registration step) gets a "users" Firestore doc too.
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result?.user) return;
        const userRef = doc(db, "users", result.user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            name: result.user.displayName ?? "",
            email: result.user.email ?? "",
            role: "student",
            createdAt: serverTimestamp(),
          });
        }
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Google redirect sign-in error:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await fetchUserDoc(fbUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, fetchUserDoc]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin: user?.role === "admin",
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
