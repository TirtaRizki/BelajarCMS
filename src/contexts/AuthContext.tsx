
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, ServerActionResponse } from '@/types';
import { loginAction, updateUserProfileAction, logoutAction } from '@/app/actions/auth';

// This is the mock user that will be used across the app in dev mode.
const MOCK_USER: User = {
    id: 'dev-user-01',
    name: 'Tirta (Dev Mode)',
    email: 'tirta@gmail.com',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserContext: (updatedData: Partial<Pick<User, 'name' | 'email' | 'role'>>) => Promise<User | null>;
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
    // In a fully mocked environment, we bypass async calls and directly set a mock user.
    // This ensures the application starts instantly and without any network-related errors.
    console.log("AuthContext: Initializing with mock user.");
    setUser(MOCK_USER);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    const response = await loginAction(email, pass);
    if (response.success && response.data) {
      setUser(response.data);
      setIsLoading(false);
      return true;
    } else {
      setAuthError("Login failed (mock response).");
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await logoutAction();
    setUser(null);
    setIsLoading(false);
    router.push('/login');
  }, [router]);

  const updateUserContext = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'email' | 'role'>>): Promise<User | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    const response = await updateUserProfileAction(user.id, updatedData);
    if (response.success && response.data) {
      setUser(response.data);
      setIsLoading(false);
      return response.data;
    } else {
      setIsLoading(false);
      return null; 
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
