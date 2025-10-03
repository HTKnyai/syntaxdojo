'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { User } from '@/types/user';
import { Result, AppError } from '@/types/common';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<Result<User, AppError>>;
  signIn: (email: string, password: string) => Promise<Result<User, AppError>>;
  signInAnonymous: () => Promise<Result<User, AppError>>;
  signOut: () => Promise<Result<void, AppError>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function firebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName,
    createdAt: firebaseUser.metadata.creationTime
      ? new Date(firebaseUser.metadata.creationTime)
      : new Date(),
  };
}

function createAppError(error: unknown): AppError {
  if (error instanceof Error) {
    const errorCode = (error as any).code;

    switch (errorCode) {
      case 'auth/invalid-email':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return {
          type: 'VALIDATION_ERROR',
          message: 'メールアドレスまたはパスワードが正しくありません',
        };
      case 'auth/email-already-in-use':
        return {
          type: 'VALIDATION_ERROR',
          message: 'このメールアドレスは既に使用されています',
        };
      case 'auth/weak-password':
        return {
          type: 'VALIDATION_ERROR',
          message: 'パスワードは6文字以上で設定してください',
        };
      case 'auth/network-request-failed':
        return {
          type: 'NETWORK_ERROR',
          message: 'ネットワークエラーが発生しました',
        };
      default:
        return {
          type: 'UNKNOWN_ERROR',
          message: error.message || '不明なエラーが発生しました',
        };
    }
  }

  return {
    type: 'UNKNOWN_ERROR',
    message: '不明なエラーが発生しました',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUserToUser(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<Result<User, AppError>> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(userCredential.user, { displayName });

      const user = firebaseUserToUser(userCredential.user);
      setUser({ ...user, displayName }); // Update local state with displayName

      return { success: true, data: { ...user, displayName } };
    } catch (error) {
      return { success: false, error: createAppError(error) };
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<Result<User, AppError>> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = firebaseUserToUser(userCredential.user);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: createAppError(error) };
    }
  };

  const signInAnonymous = async (): Promise<Result<User, AppError>> => {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = firebaseUserToUser(userCredential.user);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: createAppError(error) };
    }
  };

  const signOut = async (): Promise<Result<void, AppError>> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: createAppError(error) };
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    signUp,
    signIn,
    signInAnonymous,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
