
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, ServerActionResponse } from '@/types';
import { loginAction, fetchUserProfile, updateUserProfileAction, logoutAction } from '@/app/actions/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserContext: (updatedData: Partial<Pick<User, 'displayName' | 'email' | 'role'>>) => Promise<User | null>;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      setAuthError(null);
      // In a real app with HttpOnly cookie sessions, this might not be needed,
      // or you'd have an API endpoint to verify the session.
      // For now, we assume no client-side token implies no session.
      // We could try to fetch based on a stored user ID if we wanted to persist mock session client-side.
      const response: ServerActionResponse<User | null> = await fetchUserProfile(); // This will return null as no ID is passed.
      if (response.success && response.data) {
        setUser(response.data);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = useCallback(async (username: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await loginAction(username, pass);
      if (response.success && response.data) {
        setUser(response.data);
        setIsLoading(false);
        return true;
      } else {
        setAuthError(response.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message || "An unexpected error occurred during login.");
      setUser(null);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error if necessary
    }
    setUser(null);
    setIsLoading(false);
    router.push('/login');
  }, [router]);

  const updateUserContext = useCallback(async (updatedData: Partial<Pick<User, 'displayName' | 'email' | 'role'>>): Promise<User | null> => {
    if (!user) {
      setAuthError("No user logged in to update.");
      return null;
    }
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await updateUserProfileAction(user.id, updatedData);
      if (response.success && response.data) {
        setUser(response.data);
        setIsLoading(false);
        return response.data;
      } else {
        setAuthError(response.error || "Failed to update profile.");
        setIsLoading(false);
        return null;
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      setAuthError(error.message || "Failed to update profile.");
      setIsLoading(false);
      return user; // Return current user state on failure to avoid UI thinking it's null
    }
  }, [user]);
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserContext, isLoading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
