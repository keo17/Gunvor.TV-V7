import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  type UserCredential,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./config";

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential;
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// You can also create a hook to listen to auth state changes if not using a context provider,
// or if you need it in specific non-component files.
// For components, useAuth from FirebaseAuthContext is preferred.
export const onAuthChanged = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const updateUserProfile = async (user: FirebaseUser, profileData: { displayName?: string; photoURL?: string }) => {
  if (!user) throw new Error("User not authenticated.");
  await updateProfile(user, profileData);
  // Potentially return the updated user object or trigger a state refresh if needed
  return auth.currentUser; 
};
