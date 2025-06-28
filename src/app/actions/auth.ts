
'use server';

import type { User, ServerActionResponse, ApiResponse } from '@/types';
import { cookies } from 'next/headers';

// This is the user that will be loaded if the backend is offline.
export const MOCK_ADMIN_USER: User = {
    id: 1,
    name: 'Admin (Offline Mode)',
    email: 'admin.offline@example.com',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

/**
 * Fetches a JWT from the backend and stores it in a secure, HTTP-only cookie.
 * This is the primary mechanism for authenticating server-to-server requests.
 */
export async function fetchAndSetJwtAction(): Promise<ServerActionResponse<{token: string}>> {
  console.log('Attempting to fetch JWT from backend...');
  try {
    const response = await fetch('http://localhost:3001/api/jwt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'BBC' }), // As per API documentation
      cache: 'no-store',
    });

    if (!response.ok) {
       let errorMsg = `The JWT endpoint returned an unexpected response (Status: ${response.status}).`;
       try {
         const errorBody = await response.json();
         errorMsg = errorBody.message || errorMsg;
       } catch (e) { /* Ignore if body isn't JSON */ }
       console.error('JWT fetch failed:', errorMsg);
       return { success: false, error: errorMsg };
    }

    const result: ApiResponse<{ token: string }> = await response.json();
    if (result.success && result.token) {
      cookies().set('token', result.token, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production' });
      return { success: true, data: { token: result.token } };
    } else {
      return { success: false, error: 'Backend did not return a token.' };
    }
  } catch (error) {
    console.error('Could not connect to the backend for JWT.', error);
    return { success: false, error: 'Could not connect to the backend. Please ensure the backend server is running.' };
  }
}

/**
 * Mocks a user login. In a real app, this would verify credentials against the backend.
 * Here, it just provides a consistent user object for the session.
 */
export async function loginAction(email: string, pass: string): Promise<ServerActionResponse<User>> {
  console.log('MOCK: loginAction called for', email);
  if (email && pass) {
    // We return a mock user, but the key is that `fetchAndSetJwtAction` will have already run
    // and set a real cookie if the backend is available.
    return { success: true, data: MOCK_ADMIN_USER };
  } else {
    return { success: false, error: "Invalid credentials (mock)" };
  }
}


/**
 * Logs the user out by clearing the session cookie.
 */
export async function logoutAction(): Promise<ServerActionResponse> {
  console.log('logoutAction called.');
  cookies().delete('token');
  return { success: true };
}
