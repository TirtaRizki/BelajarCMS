
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { loginAction, logoutAction, fetchAndSetJwtAction, MOCK_ADMIN_USER } from '@/app/actions/auth';
import { fetchUsersAction, updateUserAction } from '@/app/actions/users';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserContext: (updatedData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<User | null>;
  isLoading: boolean;
  authError: string | null;
  backendOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const router = useRouter();

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    console.log("AuthContext: Initializing session...");

    const jwtResponse = await fetchAndSetJwtAction();
    if (jwtResponse.success) {
      console.log("AuthContext: JWT token successfully obtained. Backend is online.");
      setBackendOnline(true);
      
      const usersResponse = await fetchUsersAction();
      if (usersResponse.success && usersResponse.data) {
        // Find the first admin user from the API to act as the logged-in user
        const adminUser = usersResponse.data.find(u => u.role === 'ADMIN');
        if(adminUser) {
          console.log(`AuthContext: Logged in as ADMIN user from backend: ${adminUser.name}`);
          setUser(adminUser);
        } else {
          console.warn("AuthContext: No ADMIN user found from backend, falling back to mock user.");
          setUser(MOCK_ADMIN_USER);
        }
      } else {
        console.error("AuthContext: Failed to fetch users from backend, falling back to mock user.", usersResponse.error);
        setUser(MOCK_ADMIN_USER);
      }
    } else {
      console.warn("AuthContext: Backend is offline or JWT fetch failed. Using mock session.", jwtResponse.error);
      setBackendOnline(false);
      setUser(MOCK_ADMIN_USER);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    const response = await loginAction(email, pass);
    if (response.success) {
      // Re-initialize to fetch real data if backend is now online
      await initializeAuth();
      setIsLoading(false);
      return true;
    } else {
      setAuthError("Login failed (mock response).");
      setIsLoading(false);
      return false;
    }
  }, [initializeAuth]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    if (backendOnline) {
      await logoutAction();
    }
    setUser(null);
    setIsLoading(false);
    router.push('/login');
  }, [router, backendOnline]);

  const updateUserContext = useCallback(async (updatedData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> => {
    if (!user) return null;
    
    // If backend is offline, update the local mock user state
    if (!backendOnline) {
      const updatedMockUser = { ...user, ...updatedData };
      setUser(updatedMockUser);
      console.log("Updated user in offline mode:", updatedMockUser);
      return updatedMockUser;
    }

    // If backend is online, call the real API
    const response = await updateUserAction(user.id, updatedData);
    if (response.success && response.data) {
      setUser(response.data);
      return response.data;
    } else {
      console.error("Failed to update user via API:", response.error);
      return null; 
    }
  }, [user, backendOnline]);
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserContext, isLoading, authError, backendOnline }}>
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
