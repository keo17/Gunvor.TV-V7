import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== "undefined" && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // This case is for server-side rendering or environments where window is not defined
  // and Firebase hasn't been initialized yet. It's less common for client-heavy Firebase SDK usage.
  // For server-side admin tasks, you'd use firebase-admin.
  // For client-side Next.js, the above conditions usually cover it.
  // If you have specific server-side needs with client SDK (unusual), this might need adjustment.
  // For now, we'll log an issue or handle as per specific SSR/Firebase client SDK strategy.
  // console.warn("Firebase app not initialized and window is not available.");
  // Fallback initialization for server components if necessary, though client SDK is primarily for client.
   app = initializeApp(firebaseConfig); // This might cause issues if run multiple times on server.
   auth = getAuth(app);
   db = getFirestore(app);
}


export { app, auth, db };

