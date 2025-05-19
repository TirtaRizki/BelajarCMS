
"use client";

import { useState, useEffect } from 'react';
import type { NewsItem } from '@/types';
import { NewsForm } from './NewsForm';
import { NewsCard } from './NewsCard';
import { EditNewsModal } from './EditNewsModal';
import { Newspaper, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const NEWS_STORAGE_KEY = 'nextadminlite_news';

export function NewsManagementClient() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [isEditNewsModalOpen, setIsEditNewsModalOpen] = useState(false);
  const [editingNewsItem, setEditingNewsItem] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedNews = localStorage.getItem(NEWS_STORAGE_KEY);
      if (storedNews) {
        const parsedNews = JSON.parse(storedNews).map((item: NewsItem) => ({
          ...item,
          publishedAt: new Date(item.publishedAt) 
        }));
        setNewsItems(parsedNews);
      }
    } catch (error) {
      console.error("Failed to load news from localStorage:", error);
      toast({ title: "Loading Error", description: "Could not load news data.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(newsItems));
      } catch (error) {
        console.error("Failed to save news to localStorage:", error);
        toast({ title: "Storage Error", description: "Could not save news data.", variant: "destructive" });
      }
    }
  }, [newsItems, isClient, toast]);

  const handleNewsAdded = (newNews: NewsItem) => {
    setNewsItems((prevNews) => [newNews, ...prevNews].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
    setShowForm(false);
  };

  const handleOpenEditNewsModal = (newsItem: NewsItem) => {
    setEditingNewsItem(newsItem);
    setIsEditNewsModalOpen(true);
  };

  const handleUpdateNewsItem = (newsId: string, updatedData: Partial<Omit<NewsItem, 'id' | 'publishedAt'>>) => {
    setNewsItems((prevNews) =>
      prevNews.map((item) =>
        item.id === newsId ? { ...item, ...updatedData, publishedAt: new Date() } : item // Update publishedAt on edit
      )
    );
  };

  const handleDeleteNewsItem = (newsId: string) => {
    setNewsItems((prevNews) => prevNews.filter((item) => item.id !== newsId));
    toast({ title: "News Item Deleted", description: "The news item has been successfully deleted." });
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
        <h1 className="text-3xl font-bold">News Management (Berita)</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New News'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <NewsForm onNewsAdded={handleNewsAdded} />
        </div>
      )}
      
      {newsItems.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
          <Newspaper className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No News Items Yet</h2>
          <p className="text-muted-foreground">Add your first news item using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((newsItem) => (
            <NewsCard 
              key={newsItem.id} 
              newsItem={newsItem} 
              onEditNews={handleOpenEditNewsModal}
              onDeleteNews={handleDeleteNewsItem} 
            />
          ))}
        </div>
      )}

      {editingNewsItem && (
        <EditNewsModal
          isOpen={isEditNewsModalOpen}
          onOpenChange={setIsEditNewsModalOpen}
          newsItem={editingNewsItem}
          onSave={handleUpdateNewsItem}
        />
      )}
    </div>
  );
}
