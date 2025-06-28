
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
  updateUserContext: (updatedData: Partial<Pick<User, 'name' | 'email' | 'role'>>) => Promise<User | null>;
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

      // Set a mock user immediately to unblock the UI and allow dashboard access.
      const mockUser: User = {
        id: 'dev-user-01',
        name: 'Tirta (Dev)',
        email: 'tirta@gmail.com',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(mockUser);

      // Now, try to get a REAL JWT token from the backend in the background.
      // This will not block the UI. It allows the app to work in "offline mode"
      // if the backend is not available.
      const jwtResponse = await fetchAndSetJwtAction();
      if (!jwtResponse.success) {
        // Log an error if it fails, but DON'T block the user.
        // The user can still navigate the CMS, but API-dependent features will fail gracefully.
        console.error("AuthContext: Failed to obtain JWT token in the background.", jwtResponse.error);
      } else {
        console.log("AuthContext: JWT token successfully obtained and set in cookies.");
      }
      
      setIsLoading(false);
    };

    initializeSession();
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // This uses the mock login action to grant access.
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
      console.error("Logout Error:", e);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  }, [router]);

  const updateUserContext = useCallback(async (updatedData: Partial<Pick<User, 'name' | 'email' | 'role'>>): Promise<User | null> => {
    if (!user) {
      setAuthError("No user logged in to update.");
      return null;
    }
    
    // In a real app, user.id would come from the logged-in user session.
    // For this hybrid approach, we use a consistent ID for the API call.
    const userIdToUpdate = 1; 

    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await updateUserProfileAction(userIdToUpdate, updatedData);
      if (response.success && response.data) {
        setUser(response.data); // Update context with the response from the API
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
