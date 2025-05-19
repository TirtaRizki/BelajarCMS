
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

// --- Mock API Service ---
// In a real application, these would be actual fetch calls to your backend API.

/**
 * Simulates an API call to log in a user.
 * @param username The username.
 * @param password The password.
 * @returns A Promise resolving to the User object if successful, or null/error.
 */
async function mockApiLogin(username: string, pass: string): Promise<User | null> {
  console.log("Attempting API login for:", username);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Replace with actual API call:
      // fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, pass }) })
      // .then(res => res.ok ? res.json() : Promise.reject(new Error('Login failed')))
      // .then(resolve)
      // .catch(reject);

      // Mock logic:
      if (username.trim() !== '' && pass.trim() !== '') {
        // Simulate successful login - API would return user details
        const loggedInUser: User = {
          id: `user_${Date.now()}`, // Simulate user ID from API
          username: username,
          email: `${username.toLowerCase().replace(/\s+/g, '')}@example.com`, // Simulate email from API
          displayName: username,
          role: 'admin', // Default role for prototype, API would determine this
        };
        // In a real scenario, the API might also return a token to be stored
        // localStorage.setItem('authToken', 'mock-jwt-token'); 
        resolve(loggedInUser);
      } else {
        reject(new Error("Invalid username or password"));
      }
    }, 700); // Simulate network delay
  });
}

/**
 * Simulates fetching the current user's profile, e.g., on page load to check for an active session.
 * @returns A Promise resolving to the User object if a session is active, or null.
 */
async function mockApiFetchUserProfile(): Promise<User | null> {
  console.log("Attempting to fetch user profile from API...");
  return new Promise((resolve) => {
    setTimeout(() => {
      // Replace with actual API call:
      // const token = localStorage.getItem('authToken');
      // if (!token) return resolve(null);
      // fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
      // .then(res => res.ok ? res.json() : Promise.resolve(null))
      // .then(resolve)
      // .catch(() => resolve(null));
      
      // Mock logic: For this demo, we'll assume no persistent session without a real backend token.
      // To simulate a persistent session across refreshes with a mock, you'd need
      // to store/retrieve a mock token in localStorage here and in mockApiLogin.
      resolve(null); // No user session on initial load for this simplified mock
    }, 500);
  });
}

/**
 * Simulates an API call to update the user's profile.
 * @param userId The ID of the user to update.
 * @param updates Partial user data with updates.
 * @returns A Promise resolving to the updated User object.
 */
async function mockApiUpdateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
  console.log(`Attempting API update for user ${userId} with data:`, updates);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Replace with actual API call:
      // const token = localStorage.getItem('authToken');
      // fetch(`/api/users/${userId}`, { 
      //   method: 'PATCH', 
      //   headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates) 
      // })
      // .then(res => res.ok ? res.json() : Promise.reject(new Error('Profile update failed')))
      // .then(resolve)
      // .catch(reject);

      // Mock logic: Assume success and return the updates merged with a mock existing user
      const mockCurrentUser: User = { // This would typically be the current user state or fetched again
        id: userId,
        username: updates.username || "current_username",
        email: updates.email || "current_email@example.com",
        displayName: updates.displayName || "Current Display Name",
        role: updates.role || "operator",
      };
      resolve({ ...mockCurrentUser, ...updates });
    }, 600);
  });
}

/**
 * Simulates an API call to log out a user.
 */
async function mockApiLogout(): Promise<void> {
  console.log("Attempting API logout...");
  return new Promise((resolve) => {
    setTimeout(() => {
      // Replace with actual API call if needed (e.g., to invalidate session on server)
      // fetch('/api/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
      // localStorage.removeItem('authToken'); // Clear token
      resolve();
    }, 300);
  });
}

// --- Auth Context ---

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserContext: (updatedUser: Partial<User>) => Promise<User | null>;
  isLoading: boolean;
  authError: string | null; // To display login/auth errors
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True initially to check session
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      setAuthError(null);
      try {
        const sessionUser = await mockApiFetchUserProfile();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Optionally set an error state to display to the user
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = useCallback(async (username: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const loggedInUser = await mockApiLogin(username, pass);
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsLoading(false);
        return true;
      } else {
        // This case might not be reached if mockApiLogin rejects on failure
        setAuthError("Login failed. Please check your credentials.");
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
      await mockApiLogout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Handle logout error if necessary, though usually we proceed to clear client state
    }
    setUser(null);
    setIsLoading(false);
    router.push('/login');
  }, [router]);

  const updateUserContext = useCallback(async (updatedData: Partial<User>): Promise<User | null> => {
    if (!user) {
      setAuthError("No user logged in to update.");
      return null;
    }
    setIsLoading(true);
    setAuthError(null);
    try {
      const updatedUser = await mockApiUpdateUserProfile(user.id, updatedData);
      setUser(updatedUser);
      setIsLoading(false);
      return updatedUser;
    } catch (error: any) {
      console.error("Profile update error:", error);
      setAuthError(error.message || "Failed to update profile.");
      setIsLoading(false);
      return null; // Or return current user state: return user;
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
