import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration read dynamically from environment variables
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "AIzaSyFakeKeyPlaceholder1234567890",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "leakshield-ai.firebaseapp.com",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "leakshield-ai",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "leakshield-ai.firebasestorage.app",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "1:123456789012:web:1234567890abcdef"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
