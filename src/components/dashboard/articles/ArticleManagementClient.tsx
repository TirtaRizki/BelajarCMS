
"use client";

import { useState, useEffect } from 'react';
import type { ArticleItem, ServerActionResponse } from '@/types';
import { ArticleForm } from './ArticleForm';
import { ArticleCard } from './ArticleCard';
import { EditArticleModal } from './EditArticleModal';
import { FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { fetchArticlesAction, addArticleAction, updateArticleAction, deleteArticleAction } from '@/app/actions/articles';

export function ArticleManagementClient() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      const response = await fetchArticlesAction();
      if (response.success && response.data) {
        setArticles(response.data.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(item.createdAt) // Handle potential undefined updatedAt
        })));
      } else {
        toast({ title: "Error", description: response.error || "Could not load articles.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    loadArticles();
  }, [toast]);

  const handleArticleAdded = async (newArticleDraft: Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsProcessing(true);
    const response = await addArticleAction(newArticleDraft);
    if (response.success && response.data) {
      setArticles((prev) => [response.data!, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      toast({ title: "Article Added", description: `"${response.data.title}" has been successfully added.`});
      setShowForm(false);
    } else {
      toast({ title: "Add Error", description: response.error || "Could not add article.", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  const handleOpenEditArticleModal = (article: ArticleItem) => {
    setEditingArticle(article);
    setIsEditArticleModalOpen(true);
  };

  const handleUpdateArticle = async (articleId: string, updatedData: Partial<Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setIsProcessing(true);
    const response = await updateArticleAction(articleId, updatedData);
    if (response.success && response.data) {
      setArticles((prev) =>
        prev.map((item) =>
          item.id === articleId ? { ...response.data!, createdAt: new Date(response.data!.createdAt), updatedAt: new Date(response.data!.updatedAt!) } : item
        )
      );
      toast({ title: "Article Updated", description: `"${response.data.title}" has been updated.`});
    } else {
      toast({ title: "Update Error", description: response.error || "Could not update article.", variant: "destructive" });
    }
    setIsProcessing(false);
    setIsEditArticleModalOpen(false);
  };

  const handleDeleteArticle = async (articleId: string) => {
    setIsProcessing(true);
    const response = await deleteArticleAction(articleId);
    if (response.success) {
      setArticles((prev) => prev.filter((item) => item.id !== articleId));
      toast({ title: "Article Deleted", description: "The article has been successfully deleted." });
    } else {
      toast({ title: "Delete Error", description: response.error || "Could not delete article.", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Article Management (Konten)</h1>
        <Button onClick={() => setShowForm(!showForm)} disabled={isProcessing}>
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {showForm ? 'Cancel' : 'Add New Article'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ArticleForm onArticleAdded={handleArticleAdded} isProcessing={isProcessing} />
        </div>
      )}

      {articles.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Articles Yet</h2>
          <p className="text-muted-foreground">Add your first article using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onEditArticle={handleOpenEditArticleModal}
              onDeleteArticle={handleDeleteArticle} 
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}

      {editingArticle && (
        <EditArticleModal
          isOpen={isEditArticleModalOpen}
          onOpenChange={setIsEditArticleModalOpen}
          article={editingArticle}
          onSave={handleUpdateArticle}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
