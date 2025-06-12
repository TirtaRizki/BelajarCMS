
'use server';

import type { MediaItem, ServerActionResponse } from '@/types';

let mockMediaItemStore: MediaItem[] = []; 

export async function fetchMediaItemsAction(): Promise<ServerActionResponse<MediaItem[]>> {
  console.log('Server Action: fetchMediaItemsAction');
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return { success: true, data: [...mockMediaItemStore].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()) };
}

export async function uploadMediaItemAction(
  newMediaData: Pick<MediaItem, 'name' | 'url' | 'altText'>
): Promise<ServerActionResponse<MediaItem>> {
  console.log('Server Action: uploadMediaItemAction for', newMediaData.name);
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const mediaItemToSave: MediaItem = {
    id: crypto.randomUUID(),
    name: newMediaData.name,
    url: newMediaData.url, 
    altText: newMediaData.altText || '',
    uploadedAt: new Date(),
  };
  
  mockMediaItemStore.unshift(mediaItemToSave);

  console.log('Server Action: media item upload successful for', newMediaData.name);
  return { success: true, data: mediaItemToSave };
}

export async function updateMediaItemAction(
  mediaId: string,
  updates: Partial<Pick<MediaItem, 'name' | 'altText'>>
): Promise<ServerActionResponse<MediaItem>> {
  console.log('Server Action: updateMediaItemAction for ID', mediaId, 'with updates:', updates);
  await new Promise(resolve => setTimeout(resolve, 50));

  const itemIndex = mockMediaItemStore.findIndex(item => item.id === mediaId);
  if (itemIndex === -1) {
    return { success: false, error: "Media item not found." };
  }
  
  mockMediaItemStore[itemIndex] = { 
    ...mockMediaItemStore[itemIndex], 
    ...updates, 
    // uploadedAt is preserved, altText can be explicitly set to undefined by updates
    altText: updates.altText === undefined ? mockMediaItemStore[itemIndex].altText : updates.altText,
  };
  
  console.log('Server Action: media item update successful for', mediaId);
  return { success: true, data: mockMediaItemStore[itemIndex] };
}

export async function deleteMediaItemAction(mediaId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteMediaItemAction for ID', mediaId);
  await new Promise(resolve => setTimeout(resolve, 50));

  const initialLength = mockMediaItemStore.length;
  mockMediaItemStore = mockMediaItemStore.filter(item => item.id !== mediaId);
  
  if (mockMediaItemStore.length === initialLength) {
     return { success: false, error: "Media item not found for deletion." };
  }
  
  console.log('Server Action: media item deletion successful for', mediaId);
  return { success: true };
}
