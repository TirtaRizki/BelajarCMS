
'use server';

import type { User, ServerActionResponse } from '@/types';
import { cookies } from 'next/headers';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function loginAction(username: string, pass: string): Promise<ServerActionResponse<User>> {
  console.log('Server Action: loginAction attempt for', username);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: pass }),
    });

    const result = await response.json();

    if (!result.success || !result.token) {
      return { success: false, error: result.message || 'Invalid username or password' };
    }
    
    // Set token in a secure, http-only cookie
    cookies().set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    
    // Fetch profile after successful login to get user data
    const profileResponse = await fetchUserProfile(result.token);
    if (profileResponse.success && profileResponse.data) {
        return { success: true, data: profileResponse.data };
    } else {
        return { success: false, error: "Login succeeded but failed to fetch user profile." };
    }

  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, error: 'An unexpected error occurred during login.' };
  }
}

export async function fetchUserProfile(tokenOverride?: string): Promise<ServerActionResponse<User | null>> {
  const token = tokenOverride || getAuthToken();

  if (!token) {
    return { success: true, data: null }; // No token, no user session
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401 || response.status === 403) {
      // Unauthorized or forbidden, clear cookie and return no user
      await logoutAction();
      return { success: true, data: null };
    }
    
    const result = await response.json();
    if (!result.success) {
      return { success: false, data: null, error: result.message };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Fetch User Profile Error:', error);
    return { success: false, data: null, error: 'An unexpected error occurred while fetching profile.' };
  }
}

export async function updateUserProfileAction(
  userId: string, // userId might not be needed if API determines user by token
  updates: Partial<Pick<User, 'displayName' | 'email' | 'role'>>
): Promise<ServerActionResponse<User>> {
  console.log(`Server Action: updateUserProfileAction for user with data:`, updates);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to update profile." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Update Profile Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function logoutAction(): Promise<ServerActionResponse> {
  console.log('Server Action: logoutAction attempt');
  // Clear the cookie
  cookies().delete('token');
  return { success: true };
}
