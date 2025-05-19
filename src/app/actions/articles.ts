
'use server';

import type { ArticleItem, ServerActionResponse } from '@/types';

// let mockArticleStore: ArticleItem[] = [];

export async function fetchArticlesAction(): Promise<ServerActionResponse<ArticleItem[]>> {
  console.log('Server Action: fetchArticlesAction');
  await new Promise(resolve => setTimeout(resolve, 500));
  // return { success: true, data: mockArticleStore };
  return { success: true, data: [] };
}

export async function addArticleAction(
  newArticle: Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: Date, updatedAt?: Date }
): Promise<ServerActionResponse<ArticleItem>> {
  console.log('Server Action: addArticleAction for title', newArticle.title);
  await new Promise(resolve => setTimeout(resolve, 750));

  const articleToSave: ArticleItem = {
    ...newArticle,
    id: crypto.randomUUID(),
    createdAt: newArticle.createdAt || new Date(),
    updatedAt: newArticle.updatedAt || new Date(),
  };

  // mockArticleStore.unshift(articleToSave);

  console.log('Server Action: article added successfully for', newArticle.title);
  return { success: true, data: articleToSave };
}

export async function updateArticleAction(
  articleId: string,
  updates: Partial<Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ArticleItem>> {
  console.log('Server Action: updateArticleAction for ID', articleId);
  await new Promise(resolve => setTimeout(resolve, 600));

  // const articleIndex = mockArticleStore.findIndex(article => article.id === articleId);
  // if (articleIndex === -1) {
  //   return { success: false, error: "Article not found." };
  // }
  // mockArticleStore[articleIndex] = { 
  //   ...mockArticleStore[articleIndex], 
  //   ...updates, 
  //   updatedAt: new Date(),
  //   createdAt: new Date(mockArticleStore[articleIndex].createdAt) // ensure createdAt is Date
  // };
  // return { success: true, data: mockArticleStore[articleIndex] };
  
  const mockUpdatedArticle: ArticleItem = {
    id: articleId,
    title: updates.title || 'Updated Article Title',
    body: updates.body || 'Updated article body.',
    author: updates.author || 'Updated Author',
    coverImageUrl: updates.coverImageUrl,
    tags: updates.tags || [],
    createdAt: new Date(Date.now() - 200000), // Older date
    updatedAt: new Date(),
  };
  return { success: true, data: mockUpdatedArticle };
}

export async function deleteArticleAction(articleId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteArticleAction for ID', articleId);
  await new Promise(resolve => setTimeout(resolve, 400));

  // const initialLength = mockArticleStore.length;
  // mockArticleStore = mockArticleStore.filter(article => article.id !== articleId);
  // if (mockArticleStore.length === initialLength) {
  //    return { success: false, error: "Article not found." };
  // }

  console.log('Server Action: article deletion successful for', articleId);
  return { success: true };
}
