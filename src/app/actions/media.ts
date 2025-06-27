
'use server';

import type { MediaItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

// The live API does not support listing, updating, or deleting media items.
// We will use a mock in-memory store for these actions to keep the UI functional
// for the duration of the server session. The upload action, however, will
// call the real API endpoint.
let mockMediaItemStore: MediaItem[] = []; 

export async function fetchMediaItemsAction(): Promise<ServerActionResponse<MediaItem[]>> {
  console.log('Server Action: fetchMediaItemsAction (Mock)');
  // This is a mock implementation as the API does not support listing media.
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return { success: true, data: [...mockMediaItemStore].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()) };
}

export async function uploadMediaItemAction(
  newMediaData: Pick<MediaItem, 'name' | 'url' | 'altText'>
): Promise<ServerActionResponse<MediaItem>> {
  console.log('Server Action: uploadMediaItemAction for', newMediaData.name);
  const token = getAuthToken();
  if (!token) return { success: false, error: 'Not authenticated.' };

  try {
    // Convert data URI to Blob for file upload
    const fetchRes = await fetch(newMediaData.url);
    const blob = await fetchRes.blob();
    
    const formData = new FormData();
    // The API expects the file under the 'file' key
    formData.append('file', blob, newMediaData.name);

    const response = await fetch(`${API_BASE_URL}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Note: Do not set 'Content-Type' for FormData, `fetch` handles it.
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, error: result.message || 'File upload failed.' };
    }

    // Since the API only returns a URL, we'll construct a full MediaItem
    // to return to the client and add it to our mock store for listing.
    const createdMediaItem: MediaItem = {
      id: crypto.randomUUID(), // Use a random ID as the API doesn't provide one
      name: newMediaData.name,
      url: result.url, // Use the URL from the API response
      altText: newMediaData.altText,
      uploadedAt: new Date(),
    };

    mockMediaItemStore.unshift(createdMediaItem);
    
    return { success: true, data: createdMediaItem };
  } catch (error) {
    console.error('Upload Media Error:', error);
    return { success: false, error: 'An unexpected error occurred during upload.' };
  }
}

export async function updateMediaItemAction(
  mediaId: string,
  updates: Partial<Pick<MediaItem, 'name' | 'altText'>>
): Promise<ServerActionResponse<MediaItem>> {
  console.log('Server Action: updateMediaItemAction (Mock) for ID', mediaId);
  // This is a mock implementation.
  await new Promise(resolve => setTimeout(resolve, 50));

  const itemIndex = mockMediaItemStore.findIndex(item => item.id === mediaId);
  if (itemIndex === -1) {
    return { success: false, error: "Media item not found." };
  }
  
  mockMediaItemStore[itemIndex] = { 
    ...mockMediaItemStore[itemIndex], 
    ...updates,
  };
  
  return { success: true, data: mockMediaItemStore[itemIndex] };
}

export async function deleteMediaItemAction(mediaId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteMediaItemAction (Mock) for ID', mediaId);
  // This is a mock implementation.
  await new Promise(resolve => setTimeout(resolve, 50));

  const initialLength = mockMediaItemStore.length;
  mockMediaItemStore = mockMediaItemStore.filter(item => item.id !== mediaId);
  
  if (mockMediaItemStore.length === initialLength) {
     return { success: false, error: "Media item not found for deletion." };
  }
  
  return { success: true };
}
