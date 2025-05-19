
'use server';

import type { ArticleItem, ServerActionResponse } from '@/types';
// import prisma from '@/lib/prisma'; // Uncomment when Prisma schema is ready

export async function fetchArticlesAction(): Promise<ServerActionResponse<ArticleItem[]>> {
  console.log('Server Action: fetchArticlesAction');
  await new Promise(resolve => setTimeout(resolve, 500));
  // TODO: Replace with actual Prisma logic
  // const articles = await prisma.articleItem.findMany({
  //   orderBy: { createdAt: 'desc' },
  // });
  // return { success: true, data: articles.map(article => ({...article, createdAt: new Date(article.createdAt), updatedAt: new Date(article.updatedAt)})) };
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

  // TODO: Replace with actual Prisma logic
  // const savedArticle = await prisma.articleItem.create({ data: articleToSave });
  // return { success: true, data: {...savedArticle, createdAt: new Date(savedArticle.createdAt), updatedAt: new Date(savedArticle.updatedAt)} };

  console.log('Server Action: article added successfully for', newArticle.title);
  return { success: true, data: articleToSave };
}

export async function updateArticleAction(
  articleId: string,
  updates: Partial<Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ArticleItem>> {
  console.log('Server Action: updateArticleAction for ID', articleId);
  await new Promise(resolve => setTimeout(resolve, 600));

  // TODO: Replace with actual Prisma logic
  // const updatedArticle = await prisma.articleItem.update({
  //   where: { id: articleId },
  //   data: { ...updates, updatedAt: new Date() },
  // });
  // if (!updatedArticle) return { success: false, error: "Article not found." };
  // return { success: true, data: {...updatedArticle, createdAt: new Date(updatedArticle.createdAt), updatedAt: new Date(updatedArticle.updatedAt)} };
  
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

  // TODO: Replace with actual Prisma logic
  // await prisma.articleItem.delete({ where: { id: articleId } });

  console.log('Server Action: article deletion successful for', articleId);
  return { success: true };
}
