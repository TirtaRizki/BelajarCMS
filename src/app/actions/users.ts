
'use server';

import type { User, ServerActionResponse, ApiResponse } from '@/types';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = 'http://localhost:3001/api/users'; // Your backend API endpoint

// Helper to get the auth token from cookies
const getAuthToken = (): string | undefined => cookies().get('token')?.value;

export async function fetchUsersAction(): Promise<ServerActionResponse<User[]>> {
  console.log('Server Action: fetchUsersAction (Real API)');
  const token = getAuthToken();
  if (!token) return { success: false, error: "Authentication token not found." };
  
  try {
    const response = await fetch(API_BASE_URL, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Failed to fetch users: ${response.statusText}` }));
      return { success: false, error: errorData.message };
    }

    const result: ApiResponse<User[]> = await response.json();
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while fetching users.' };
  }
}

export async function updateUserAction(userId: number, updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServerActionResponse<User>> {
  console.log(`Server Action: updateUserAction for ID ${userId}`);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Authentication token not found." };

  try {
    // Backend API expects password, but we shouldn't send it if not changing
    const updatesToSend = { ...updates };
    if ('password' in updatesToSend && !updatesToSend.password) {
      delete updatesToSend.password;
    }
    
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatesToSend),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Failed to update user: ${response.statusText}` }));
      return { success: false, error: errorData.message };
    }

    const result: ApiResponse<User> = await response.json();
    revalidatePath('/dashboard/profile'); // Revalidate profile if needed
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    return { success: false, error: error.message || 'An unexpected error occurred while updating the user.' };
  }
}
