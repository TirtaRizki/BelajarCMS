
'use server';

import type { User, ServerActionResponse } from '@/types';
import { cookies } from 'next/headers';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function fetchAndSetJwtAction(): Promise<ServerActionResponse<{token: string}>> {
  console.log('Server Action: fetchAndSetJwtAction (Mock)');
  // This is a mock implementation to prevent errors when the backend is not ready.
  // It simulates a successful JWT fetch and sets a mock token.
  await new Promise(resolve => setTimeout(resolve, 50)); 
  const mockToken = 'mock-jwt-token-for-development';
  
  cookies().set('token', mockToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 hour expiration
  });

  return { success: true, data: { token: mockToken } };
}


export async function loginAction(email: string, pass: string): Promise<ServerActionResponse<User>> {
  console.log('Server Action: loginAction (Mock) attempt for', email);

  // This is a mock implementation.
  await new Promise(resolve => setTimeout(resolve, 500)); 

  // For this demo, any login is considered successful.
  if (email && pass) {
    const mockUser: User = {
        id: 'dev-user-01',
        username: email,
        email: email,
        displayName: 'Tirta (from Mock Login)',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    const mockToken = 'mock-jwt-token-from-login';
    cookies().set('token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60,
    });
    
    // In this mock flow, we just return the user data directly.
    return { success: true, data: mockUser };
  } else {
    return { success: false, error: "Invalid credentials (mock)" };
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
  console.log(`Server Action: updateUserProfileAction (Mock) for user ${userId} with data:`, updates);
  
  // As we don't have a user database, we'll merge the updates with a static mock user.
  // This simulates the backend returning the full updated user object.
  await new Promise(resolve => setTimeout(resolve, 50)); 
  
  const baseUser: User = {
    id: userId,
    username: 'tirta@gmail.com',
    email: 'tirta@gmail.com',
    displayName: 'Tirta (Dev)',
    role: 'ADMIN',
    createdAt: new Date(new Date().setDate(new Date().getDate()-1)).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedUser: User = {
      ...baseUser,
      ...updates,
      updatedAt: new Date().toISOString()
  }

  return { success: true, data: updatedUser };
}

export async function logoutAction(): Promise<ServerActionResponse> {
  console.log('Server Action: logoutAction attempt');
  cookies().delete('token');
  return { success: true };
}
