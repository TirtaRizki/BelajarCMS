
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserContext: (updatedUser: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_STORAGE_KEY = 'nextadminlite_user_profile'; // Changed to store user object

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to access localStorage for user profile:", error);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call for login
    // In a real app:
    // const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    // if (response.ok) {
    //   const userData = await response.json();
    //   const loggedInUser: User = {
    //     id: userData.id, // from API
    //     username: username,
    //     email: userData.email, // from API
    //     displayName: userData.displayName || username, // from API
    //     role: userData.role || 'operator', // from API, default to 'operator'
    //   };
    //   try {
    //     localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(loggedInUser));
    //   } catch (error) { console.error("localStorage error:", error); }
    //   setUser(loggedInUser);
    //   setIsLoading(false);
    //   return true;
    // } else {
    //   setIsLoading(false);
    //   return false;
    // }

    // For this prototype, any non-empty username/password is valid
    if (username.trim() !== '' && pass.trim() !== '') {
      const loggedInUser: User = {
        id: crypto.randomUUID(), // Simulate user ID
        username: username,
        email: `${username.toLowerCase().replace(/\s+/g, '')}@example.com`, // Simulate email
        displayName: username,
        role: 'admin', // Default role for prototype
      };
      try {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      } catch (error) {
        console.error("Failed to access localStorage:", error);
      }
      setUser(loggedInUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    // Simulate API call for logout if necessary
    // await fetch('/api/logout', { method: 'POST' });
    try {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
    setUser(null);
    router.push('/login');
  }, [router]);

  const updateUserContext = useCallback((updatedData: Partial<User>) => {
    setUser(currentUser => {
      if (currentUser) {
        const newUser = { ...currentUser, ...updatedData };
        try {
          localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(newUser));
        } catch (error) {
          console.error("Failed to save updated user to localStorage:", error);
        }
        return newUser;
      }
      return null;
    });
  }, []);
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserContext, isLoading }}>
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
