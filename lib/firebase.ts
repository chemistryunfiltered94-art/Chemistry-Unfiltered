import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// ✅ ignoreUndefinedProperties: true — optional ফিল্ড (যেমন: description: x || undefined,
// বা নতুন Deep Topic Structure-এর ঐচ্ছিক ফিল্ডগুলো) খালি রাখলে Firestore "Unsupported
// field value: undefined" এরর না দিয়ে সেই ফিল্ডটা চুপচাপ বাদ দিয়ে দেয়।
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, { ignoreUndefinedProperties: true });
} catch {
  // হট-রিলোড বা একাধিকবার import হওয়ার কারণে আগেই initialize হয়ে থাকলে বিদ্যমান instance নেয়
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;

export const storage = getStorage(app);

export default app;
