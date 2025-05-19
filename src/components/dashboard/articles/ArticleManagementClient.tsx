
"use client";

import { useState, useEffect } from 'react';
import type { ArticleItem } from '@/types';
import { ArticleForm } from './ArticleForm';
import { ArticleCard } from './ArticleCard';
import { EditArticleModal } from './EditArticleModal';
import { FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const ARTICLES_STORAGE_KEY = 'nextadminlite_articles';

export function ArticleManagementClient() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (storedArticles) {
        const parsedArticles = JSON.parse(storedArticles).map((item: ArticleItem) => ({
          ...item,
          createdAt: new Date(item.createdAt) 
        }));
        setArticles(parsedArticles);
      }
    } catch (error) {
      console.error("Failed to load articles from localStorage:", error);
      toast({ title: "Loading Error", description: "Could not load article data.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
      } catch (error) {
        console.error("Failed to save articles to localStorage:", error);
        toast({ title: "Storage Error", description: "Could not save article data.", variant: "destructive" });
      }
    }
  }, [articles, isClient, toast]);

  const handleArticleAdded = (newArticle: ArticleItem) => {
    setArticles((prevArticles) => [newArticle, ...prevArticles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setShowForm(false);
  };

  const handleOpenEditArticleModal = (article: ArticleItem) => {
    setEditingArticle(article);
    setIsEditArticleModalOpen(true);
  };

  const handleUpdateArticle = (articleId: string, updatedData: Partial<Omit<ArticleItem, 'id' | 'createdAt'>>) => {
    setArticles((prevArticles) =>
      prevArticles.map((item) =>
        item.id === articleId ? { ...item, ...updatedData, createdAt: new Date() } : item // Update createdAt on edit
      )
    );
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticles((prevArticles) => prevArticles.filter((item) => item.id !== articleId));
    toast({ title: "Article Deleted", description: "The article has been successfully deleted." });
  };

  if (!isClient) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Article Management (Konten)</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Article'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ArticleForm onArticleAdded={handleArticleAdded} />
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
        />
      )}
    </div>
  );
}
