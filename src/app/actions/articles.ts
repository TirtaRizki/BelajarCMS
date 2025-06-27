
'use server';

import type { ArticleItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function fetchArticlesAction(): Promise<ServerActionResponse<ArticleItem[]>> {
  console.log('Server Action: fetchArticlesAction (API)');
  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { tags: ['articles'] }, // For on-demand revalidation
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to fetch articles." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Fetch Articles Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function addArticleAction(
  newArticle: Omit<ArticleItem, 'id' | 'publishedAt'>
): Promise<ServerActionResponse<ArticleItem>> {
  console.log('Server Action: addArticleAction for title', newArticle.title);
  const token = getAuthToken();
   if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newArticle),
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to add article." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Add Article Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateArticleAction(
  articleId: string,
  updates: Partial<Omit<ArticleItem, 'id' | 'publishedAt'>>
): Promise<ServerActionResponse<ArticleItem>> {
  console.log('Server Action: updateArticleAction for ID', articleId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to update article." };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Update Article Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteArticleAction(articleId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteArticleAction for ID', articleId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  try {
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.status === 204 || response.status === 200) {
        // Handle cases where API returns no content on success
        const text = await response.text();
        try {
            const result = text ? JSON.parse(text) : {};
             if (result.success === false) { // Check for explicit failure message
                 return { success: false, error: result.message || "Deletion failed with an unknown error."};
             }
        } catch(e){
            // If parsing fails but status is OK, assume success
        }
        return { success: true };
    }
    
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || "Failed to delete article." };
    }
    return { success: true };
  } catch (error) {
    console.error('Delete Article Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
