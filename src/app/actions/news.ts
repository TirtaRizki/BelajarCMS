
'use server';

import type { NewsItem, ServerActionResponse } from '@/types';

// let mockNewsStore: NewsItem[] = [];

export async function fetchNewsItemsAction(): Promise<ServerActionResponse<NewsItem[]>> {
  console.log('Server Action: fetchNewsItemsAction');
  await new Promise(resolve => setTimeout(resolve, 450));
  // return { success: true, data: mockNewsStore };
  return { success: true, data: [] };
}

export async function addNewsItemAction(
  newNewsItem: Omit<NewsItem, 'id' | 'publishedAt'> & { publishedAt?: Date }
): Promise<ServerActionResponse<NewsItem>> {
  console.log('Server Action: addNewsItemAction for title', newNewsItem.title);
  await new Promise(resolve => setTimeout(resolve, 700));

  const newsItemToSave: NewsItem = {
    ...newNewsItem,
    id: crypto.randomUUID(),
    publishedAt: newNewsItem.publishedAt || new Date(),
  };

  // mockNewsStore.unshift(newsItemToSave);
  
  console.log('Server Action: news item added successfully for', newNewsItem.title);
  return { success: true, data: newsItemToSave };
}

export async function updateNewsItemAction(
  newsId: string,
  updates: Partial<Omit<NewsItem, 'id' | 'publishedAt'>>
): Promise<ServerActionResponse<NewsItem>> {
  console.log('Server Action: updateNewsItemAction for ID', newsId);
  await new Promise(resolve => setTimeout(resolve, 550));

  // const newsIndex = mockNewsStore.findIndex(item => item.id === newsId);
  // if (newsIndex === -1) {
  //   return { success: false, error: "News item not found." };
  // }
  // mockNewsStore[newsIndex] = { ...mockNewsStore[newsIndex], ...updates, publishedAt: new Date(mockNewsStore[newsIndex].publishedAt) };
  // return { success: true, data: mockNewsStore[newsIndex] };
  
  const mockUpdatedNewsItem: NewsItem = {
    id: newsId,
    title: updates.title || 'Updated Title',
    content: updates.content || 'Updated content.',
    category: updates.category || 'Updated Category',
    imageUrl: updates.imageUrl,
    publishedAt: new Date(), 
  };
  return { success: true, data: mockUpdatedNewsItem };
}

export async function deleteNewsItemAction(newsId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteNewsItemAction for ID', newsId);
  await new Promise(resolve => setTimeout(resolve, 350));

  // const initialLength = mockNewsStore.length;
  // mockNewsStore = mockNewsStore.filter(item => item.id !== newsId);
  // if (mockNewsStore.length === initialLength) {
  //    return { success: false, error: "News item not found." };
  // }
  
  console.log('Server Action: news item deletion successful for', newsId);
  return { success: true };
}
