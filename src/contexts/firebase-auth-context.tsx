"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  isDemoMode: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const isDemoMode = !loading && !user;

  if (loading) {
    // Improved loading state that mimics the app shell
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </header>
        <main className="flex-1 container py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-32 w-full" />
        </main>
        <footer className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
             <Skeleton className="h-6 w-48" />
          </div>
        </footer>
      </div>
    );
  }
  

  return (
    <FirebaseAuthContext.Provider value={{ user, loading, isDemoMode }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useAuth = (): FirebaseAuthContextType => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a FirebaseAuthProvider");
  }
  return context;
};
