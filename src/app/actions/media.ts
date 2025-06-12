
'use server';

import type { MediaItem, ServerActionResponse } from '@/types';

// let mockMediaItemStore: MediaItem[] = []; // Use this if you want persistence across reloads in dev (server-side only)

export async function fetchMediaItemsAction(): Promise<ServerActionResponse<MediaItem[]>> {
  console.log('Server Action: fetchMediaItemsAction');
  await new Promise(resolve => setTimeout(resolve, 50)); 
  // return { success: true, data: mockMediaItemStore };
  return { success: true, data: [] }; // Start empty for client-side demo
}

export async function uploadMediaItemAction(
  newMediaData: Pick<MediaItem, 'name' | 'url' | 'altText'>
): Promise<ServerActionResponse<MediaItem>> {
  console.log('Server Action: uploadMediaItemAction for', newMediaData.name);
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const mediaItemToSave: MediaItem = {
    id: crypto.randomUUID(),
    name: newMediaData.name,
    url: newMediaData.url, // This is the dataUri from the client
    altText: newMediaData.altText || '',
    uploadedAt: new Date(),
  };
  
  // mockMediaItemStore.unshift(mediaItemToSave);

  console.log('Server Action: media item upload successful for', newMediaData.name);
  return { success: true, data: mediaItemToSave };
}

export async function updateMediaItemAction(
  mediaId: string,
  updates: Partial<Pick<MediaItem, 'name' | 'altText'>>
): Promise<ServerActionResponse<MediaItem>> {
  console.log('Server Action: updateMediaItemAction for ID', mediaId, 'with updates:', updates);
  await new Promise(resolve => setTimeout(resolve, 50));

  // const itemIndex = mockMediaItemStore.findIndex(item => item.id === mediaId);
  // if (itemIndex === -1) {
  //   return { success: false, error: "Media item not found." };
  // }
  // mockMediaItemStore[itemIndex] = { 
  //   ...mockMediaItemStore[itemIndex], 
  //   ...updates, 
  //   uploadedAt: new Date(mockMediaItemStore[itemIndex].uploadedAt) 
  // };
  // return { success: true, data: mockMediaItemStore[itemIndex] };

  // Mock update
  const mockUpdatedItem: MediaItem = {
    id: mediaId,
    name: updates.name || `Media ${mediaId.substring(0,4)}`,
    url: `https://placehold.co/300x200.png?text=${updates.name?.substring(0,10) || 'Updated'}`, // Placeholder URL for mock
    altText: updates.altText || '',
    uploadedAt: new Date() 
  };
  return { success: true, data: mockUpdatedItem };
}

export async function deleteMediaItemAction(mediaId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteMediaItemAction for ID', mediaId);
  await new Promise(resolve => setTimeout(resolve, 50));

  // const initialLength = mockMediaItemStore.length;
  // mockMediaItemStore = mockMediaItemStore.filter(item => item.id !== mediaId);
  // if (mockMediaItemStore.length === initialLength) {
  //    return { success: false, error: "Media item not found." };
  // }
  
  console.log('Server Action: media item deletion successful for', mediaId);
  return { success: true };
}
