
'use server';

import type { User, ServerActionResponse, ApiResponse } from '@/types';
import { cookies } from 'next/headers';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

export async function fetchAndSetJwtAction(): Promise<ServerActionResponse<{token: string}>> {
  try {
    console.log('Server Action: Attempting to fetch JWT from', `${API_BASE_URL}/jwt`);
    const response = await fetch(`${API_BASE_URL}/jwt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: "BBC" }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`JWT fetch failed with status ${response.status}:`, errorText);
      return { success: false, error: `The JWT endpoint returned an unexpected response (Status: ${response.status}). Please check the backend server logs.` };
    }

    const result: ApiResponse<{ token: string }> = await response.json();
    
    if (result.success && result.token) {
      cookies().set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60, // 1 hour
      });
      return { success: true, data: { token: result.token } };
    } else {
      return { success: false, error: "Failed to get token from API response." };
    }
  } catch (error) {
    console.error("An unexpected error occurred while fetching JWT:", error);
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      return { success: false, error: "Could not connect to the backend. Please ensure the backend server is running." };
    }
    return { success: false, error: "An unexpected error occurred while fetching JWT." };
  }
}

// This remains a mock to allow easy entry into the dashboard during development.
export async function loginAction(email: string, pass: string): Promise<ServerActionResponse<User>> {
  console.log('Server Action: loginAction (Mock) attempt for', email);
  await new Promise(resolve => setTimeout(resolve, 500)); 

  if (email && pass) {
    const mockUser: User = {
        id: 'dev-user-01',
        name: 'Tirta (from Mock Login)',
        email: email,
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    // We simulate setting a token, although fetchAndSetJwtAction is the primary source
    const mockToken = 'mock-jwt-token-from-login';
    cookies().set('token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60,
    });
    
    return { success: true, data: mockUser };
  } else {
    return { success: false, error: "Invalid credentials (mock)" };
  }
}

// The API spec doesn't have a GET /me or /profile endpoint, so we keep this mocked.
export async function fetchUserProfile(tokenOverride?: string): Promise<ServerActionResponse<User | null>> {
  console.log('Server Action: fetchUserProfile (Mock)');
  const token = tokenOverride || getAuthToken();

  if (!token) {
    return { success: true, data: null };
  }
  
  await new Promise(resolve => setTimeout(resolve, 50)); 
  const mockUser: User = {
    id: 'dev-user-01',
    name: 'Tirta (from Mock Profile)',
    email: 'tirta@gmail.com',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { success: true, data: mockUser };
}

export async function updateUserProfileAction(
  userId: string | number,
  updates: Partial<Pick<User, 'name' | 'email' | 'role'>>
): Promise<ServerActionResponse<User>> {
   const token = getAuthToken();
  if (!token) {
    return { success: false, error: 'Authentication token not found. Cannot update profile.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
      cache: 'no-store',
    });

    const result: ApiResponse<User> = await response.json();

    if (!result.success) {
      return { success: false, error: result.message || 'Failed to update user profile.' };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
     if (error instanceof TypeError && error.message.includes('fetch failed')) {
      return { success: false, error: "Could not connect to the backend to update profile." };
    }
    return { success: false, error: 'An unexpected error occurred during profile update.' };
  }
}

export async function logoutAction(): Promise<ServerActionResponse> {
  console.log('Server Action: logoutAction attempt');
  cookies().delete('token');
  return { success: true };
}
