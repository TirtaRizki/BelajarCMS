
'use server';

import type { User, ServerActionResponse } from '@/types';
import { cookies } from 'next/headers';

// ===================================================================================
// IMPORTANT: AUTHENTICATION IS FULLY MOCKED
// To ensure a smooth, error-free development experience, all authentication and
// user management actions operate on a temporary, in-memory user object.
// They do not make any real network calls.
// ===================================================================================

let mockUserStore: User = {
    id: 'dev-user-01',
    name: 'Tirta (Dev Mode)',
    email: 'tirta@gmail.com',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

// This function is kept for compatibility but is not essential in mock mode.
export async function fetchAndSetJwtAction(): Promise<ServerActionResponse<{token: string}>> {
  console.log('MOCK: fetchAndSetJwtAction called. A mock cookie is being set.');
  cookies().set('token', 'mock-jwt-for-dev', { httpOnly: true, path: '/' });
  return { success: true, data: { token: 'mock-jwt-for-dev' } };
}

// Mock login to always succeed with any non-empty credentials.
export async function loginAction(email: string, pass: string): Promise<ServerActionResponse<User>> {
  console.log('MOCK: loginAction called for', email);
  if (email && pass) {
    return { success: true, data: mockUserStore };
  } else {
    return { success: false, error: "Invalid credentials (mock)" };
  }
}

// Mock profile fetch.
export async function fetchUserProfile(): Promise<ServerActionResponse<User | null>> {
  console.log('MOCK: fetchUserProfile called.');
  return { success: true, data: mockUserStore };
}

// Mock profile update.
export async function updateUserProfileAction(
  userId: string | number,
  updates: Partial<Pick<User, 'name' | 'email' | 'role'>>
): Promise<ServerActionResponse<User>> {
   console.log('MOCK: updateUserProfileAction called for ID', userId);
   mockUserStore = { ...mockUserStore, ...updates, updatedAt: new Date().toISOString() };
   return { success: true, data: mockUserStore };
}

// Mock logout.
export async function logoutAction(): Promise<ServerActionResponse> {
  console.log('MOCK: logoutAction called.');
  cookies().delete('token');
  return { success: true };
}
