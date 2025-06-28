
'use server';

import type { User, ServerActionResponse } from '@/types';
import { cookies } from 'next/headers';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function loginAction(email: string, pass: string): Promise<ServerActionResponse<User>> {
  console.log('Server Action: loginAction attempt for', email);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: pass }),
    });

    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Login failed with non-JSON response:', errorText);
        const errorMessage = response.status === 401 
            ? 'Invalid email or password.' 
            : `The server returned an unexpected response (Status: ${response.status}). Please check the backend server logs.`;
        return { success: false, error: errorMessage };
    }

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
    
    const profileResponse = await fetchUserProfile(result.token);
    if (profileResponse.success && profileResponse.data) {
        return { success: true, data: profileResponse.data };
    } else {
        await logoutAction();
        return { success: false, error: "Login succeeded but failed to fetch user profile. The backend might be missing a profile endpoint." };
    }

  } catch (error) {
    console.error('Login Error:', error);
    if (error instanceof Error && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED'))) {
        return { success: false, error: `Could not connect to the backend at ${API_BASE_URL}. Is the backend server running?` };
    }
    return { success: false, error: 'An unexpected error occurred during login.' };
  }
}

export async function fetchUserProfile(tokenOverride?: string): Promise<ServerActionResponse<User | null>> {
  console.log('Server Action: fetchUserProfile (Mock)');
  const token = tokenOverride || getAuthToken();

  if (!token) {
    return { success: true, data: null };
  }

  // This is a mock implementation as the API does not have a profile endpoint.
  // We'll return a hardcoded user if a token exists.
  await new Promise(resolve => setTimeout(resolve, 50)); 
  const mockUser: User = {
    id: 'dev-user-01',
    username: 'tirta@gmail.com',
    email: 'tirta@gmail.com',
    displayName: 'Tirta (from Mock Profile)',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { success: true, data: mockUser };
}

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
    
    const responseData = result.data;
    const normalizedUser: User = {
        id: responseData.id,
        username: responseData.email,
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
