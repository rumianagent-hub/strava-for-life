"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { userRepository } from "@/lib/repositories/user.repository";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await userRepository.upsert(u.uid, {
            displayName: u.displayName || "",
            photoURL: u.photoURL || "",
            email: u.email || "",
          });
        } catch (e) {
          console.error("Failed to upsert user:", e);
          setError("Failed to sync user profile");
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Sign-in failed:", e);
      setError("Sign-in failed. Please try again.");
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error("Sign-out failed:", e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
