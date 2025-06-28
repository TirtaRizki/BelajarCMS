
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, ServerActionResponse } from '@/types';
import { fetchAndSetJwtAction, loginAction, fetchUserProfile, updateUserProfileAction, logoutAction } from '@/app/actions/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserContext: (updatedData: Partial<Pick<User, 'displayName' | 'email' | 'role'>>) => Promise<User | null>;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (error: ServerActionResponse['error'], defaultMessage: string): string => {
    if (!error) return defaultMessage;
    if (typeof error === 'string') return error;
    const firstErrorKey = Object.keys(error)[0];
    if (firstErrorKey && Array.isArray(error[firstErrorKey]) && error[firstErrorKey].length > 0) {
        return error[firstErrorKey][0];
    }
    return defaultMessage;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true);
      setAuthError(null);

      // Immediately set a mock user to unblock the UI and grant access to the dashboard.
      const mockUser: User = {
        id: 'dev-user-01',
        username: 'tirta@gmail.com',
        email: 'tirta@gmail.com',
        displayName: 'Tirta (Dev)',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(mockUser);

      // REMOVED the call to fetchAndSetJwtAction.
      // This eliminates the background fetch and the console error.
      // The application will now function without a real JWT token.
      console.log("AuthContext: Bypassing JWT fetch. Using mock user for development.");
      
      setIsLoading(false);
    };

    initializeSession();
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    // This function is kept for potential future use with a real login form.
    // In the current "no-login" flow, authentication is handled automatically on load.
    console.log("Login function called, but authentication is handled automatically.");
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await loginAction(email, pass);
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setAuthError(getErrorMessage(response.error, "Login failed. Please check your credentials."));
        return false;
      }
    } catch (e) {
      setAuthError("An unexpected error occurred during login.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await logoutAction();
    } catch (e) {
      // Error during logout is usually not critical to user, but log it.
      console.error("Logout Error:", e);
    } finally {
      setUser(null);
      setIsLoading(false);
      // On logout, redirect to login page. To log back in, a refresh is needed.
      router.push('/login');
    }
  }, [router]);

  const updateUserContext = useCallback(async (updatedData: Partial<Pick<User, 'displayName' | 'email' | 'role'>>): Promise<User | null> => {
    if (!user) {
      setAuthError("No user logged in to update.");
      return null;
    }
    const userIdToUpdate = user.id || 4; // Use user ID or fallback

    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await updateUserProfileAction(userIdToUpdate, updatedData);
      if (response.success && response.data) {
        // Update local context with the new, normalized user data from the API/mock
        setUser(response.data);
        return response.data;
      } else {
        setAuthError(getErrorMessage(response.error, "Failed to update profile."));
        return null; 
      }
    } catch (e) {
      setAuthError("An unexpected error occurred while updating profile.");
      return null;
    } finally {
      setIsLoading(false);
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
