
'use server';

import type { NewsItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function fetchNewsItemsAction(): Promise<ServerActionResponse<NewsItem[]>> {
  console.log('Server Action: fetchNewsItemsAction (API)');
  try {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['news'] },
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to fetch news items." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Fetch News Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function addNewsItemAction(
  newNewsItem: Omit<NewsItem, 'id' | 'publishedAt'>
): Promise<ServerActionResponse<NewsItem>> {
  console.log('Server Action: addNewsItemAction for title', newNewsItem.title);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newNewsItem),
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to add news item." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Add News Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateNewsItemAction(
  newsItemId: string,
  updates: Partial<Omit<NewsItem, 'id' | 'publishedAt'>>
): Promise<ServerActionResponse<NewsItem>> {
  console.log('Server Action: updateNewsItemAction for ID', newsItemId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/news/${newsItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to update news item." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Update News Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteNewsItemAction(newsItemId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteNewsItemAction for ID', newsItemId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/news/${newsItemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.status === 204 || response.status === 200) {
        const text = await response.text();
        try {
            const result = text ? JSON.parse(text) : {};
             if (result.success === false) {
                 return { success: false, error: result.message || "Deletion failed."};
             }
        } catch(e) {}
        return { success: true };
    }

    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to delete news item." };
    }
    return { success: true };
  } catch (error) {
    console.error('Delete News Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
