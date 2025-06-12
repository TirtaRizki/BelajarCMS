
'use server';

import type { NewsItem, ServerActionResponse } from '@/types';

let mockNewsStore: NewsItem[] = [];

export async function fetchNewsItemsAction(): Promise<ServerActionResponse<NewsItem[]>> {
  console.log('Server Action: fetchNewsItemsAction');
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return { success: true, data: [...mockNewsStore].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()) };
}

export async function addNewsItemAction(
  newNewsItem: Omit<NewsItem, 'id' | 'publishedAt'> & { publishedAt?: Date }
): Promise<ServerActionResponse<NewsItem>> {
  console.log('Server Action: addNewsItemAction for title', newNewsItem.title);
  await new Promise(resolve => setTimeout(resolve, 50));

  const newsItemToSave: NewsItem = {
    ...newNewsItem,
    id: crypto.randomUUID(),
    publishedAt: newNewsItem.publishedAt || new Date(),
  };
  mockNewsStore.unshift(newsItemToSave);
  console.log('Server Action: news item added successfully for', newNewsItem.title);
  return { success: true, data: newsItemToSave };
}

export async function updateNewsItemAction(
  newsItemId: string,
  updates: Partial<Omit<NewsItem, 'id' | 'publishedAt'>>
): Promise<ServerActionResponse<NewsItem>> {
  console.log('Server Action: updateNewsItemAction for ID', newsItemId);
  await new Promise(resolve => setTimeout(resolve, 50));

  const newsItemIndex = mockNewsStore.findIndex(n => n.id === newsItemId);
  if (newsItemIndex === -1) {
    return { success: false, error: "News item not found." };
  }
  
  mockNewsStore[newsItemIndex] = { 
    ...mockNewsStore[newsItemIndex], 
    ...updates, 
    // publishedAt: new Date(mockNewsStore[newsItemIndex].publishedAt) // Keep original publish date
  };
  
  console.log('Server Action: news item update successful for', newsItemId);
  return { success: true, data: mockNewsStore[newsItemIndex] };
}

export async function deleteNewsItemAction(newsItemId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteNewsItemAction for ID', newsItemId);
  await new Promise(resolve => setTimeout(resolve, 50));

  const initialLength = mockNewsStore.length;
  mockNewsStore = mockNewsStore.filter(n => n.id !== newsItemId);
  
  if (mockNewsStore.length === initialLength) {
     return { success: false, error: "News item not found for deletion." };
  }
  console.log('Server Action: news item deletion successful for', newsItemId);
  return { success: true };
}
