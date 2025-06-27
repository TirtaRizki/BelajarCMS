
'use server';

import type { User, ServerActionResponse } from '@/types';
import { cookies } from 'next/headers';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

// This function is adjusted to use the /auth/login endpoint, which is standard for credentials-based login.
// The /jwt endpoint in the documentation seems to be for a different purpose (e.g., service token)
// as its example payload doesn't include user credentials.
export async function loginAction(email: string, pass: string): Promise<ServerActionResponse<User>> {
  console.log('Server Action: loginAction attempt for', email);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: pass }),
    });

    const result = await response.json();

    if (!result.success || !result.token) {
      return { success: false, error: result.message || 'Invalid email or password' };
    }
    
    cookies().set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    
    // The documentation does not specify a profile fetching endpoint.
    // We will assume one exists at /auth/profile for now to keep the UI functional.
    const profileResponse = await fetchUserProfile(result.token);
    if (profileResponse.success && profileResponse.data) {
        return { success: true, data: profileResponse.data };
    } else {
        // If profile fetching fails, we can still proceed with a successful login
        // but the user data will be minimal. Or return an error.
        // Let's return an error to be safe.
        await logoutAction(); // Clear the potentially invalid session
        return { success: false, error: "Login succeeded but failed to fetch user profile. The backend might be missing a profile endpoint." };
    }

  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, error: 'An unexpected error occurred during login.' };
  }
}

// NOTE: The new documentation does not provide an endpoint to get the current user's profile.
// This function assumes an endpoint like /auth/profile exists. If not, this will fail.
export async function fetchUserProfile(tokenOverride?: string): Promise<ServerActionResponse<User | null>> {
  const token = tokenOverride || getAuthToken();

  if (!token) {
    return { success: true, data: null };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401 || response.status === 403) {
      await logoutAction();
      return { success: true, data: null };
    }
    
    const result = await response.json();
    if (!result.success) {
      return { success: false, data: null, error: result.message };
    }
    
    // Normalize role to uppercase to match frontend expectations
    if (result.data && result.data.role) {
      result.data.role = result.data.role.toUpperCase();
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Fetch User Profile Error:', error);
    return { success: false, data: null, error: 'An unexpected error occurred while fetching profile.' };
  }
}

// This function is adjusted to use the PUT /users/:id endpoint.
export async function updateUserProfileAction(
  userId: string | number,
  updates: Partial<Pick<User, 'displayName' | 'email' | 'role'>>
): Promise<ServerActionResponse<User>> {
  console.log(`Server Action: updateUserProfileAction for user ${userId} with data:`, updates);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  const payload: any = {};
  if (updates.displayName) payload.name = updates.displayName;
  if (updates.email) payload.email = updates.email;
  // API expects uppercase role.
  if (updates.role) payload.role = updates.role.toUpperCase();

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to update profile." };
    }
    
    // Normalize response data for frontend
    const responseData = result.data;
    const normalizedUser: User = {
        id: responseData.id,
        username: responseData.email, // Assuming username is email
        email: responseData.email,
        displayName: responseData.name,
        role: responseData.role.toUpperCase(),
        createdAt: responseData.createdAt,
        updatedAt: responseData.updatedAt,
    };

    return { success: true, data: normalizedUser };
  } catch (error) {
    console.error('Update Profile Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function logoutAction(): Promise<ServerActionResponse> {
  console.log('Server Action: logoutAction attempt');
  cookies().delete('token');
  return { success: true };
}
