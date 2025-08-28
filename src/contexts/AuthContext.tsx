"use client";

import React, { createContext, useContext, useEffect } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { useUserStore } from "@/store/userStore";
import { createUser } from "@/services/userService";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { 
    authUser, 
    authLoading, 
    setAuthUser, 
    setAuthLoading, 
    clearUser 
  } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        setAuthUser(firebaseUser);
        setAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setAuthUser, setAuthLoading]);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Giriş hatası:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<void> => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName && firebaseUser) {
        await updateProfile(firebaseUser, { displayName });
      }

      // Firestore'a kullanıcı kaydı oluştur
      if (firebaseUser) {
        await createUser(
          firebaseUser.uid,
          firebaseUser.email || email,
          displayName || firebaseUser.displayName
        );
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      clearUser();
    } catch (error) {
      console.error("Çıkış hatası:", error);
      throw error;
    }
  };

  // Backward compatibility için AuthUser formatına çevir
  const user: AuthUser | null = authUser ? {
    uid: authUser.uid,
    email: authUser.email,
    displayName: authUser.displayName,
    photoURL: authUser.photoURL,
  } : null;

  const value: AuthContextType = {
    user,
    loading: authLoading,
    signIn,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
