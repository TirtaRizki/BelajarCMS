
"use client";

import { useState, useEffect } from 'react';
import type { NewsItem, ServerActionResponse } from '@/types';
import { NewsForm } from './NewsForm';
import { NewsCard } from './NewsCard';
import { EditNewsModal } from './EditNewsModal';
import { Newspaper, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { fetchNewsItemsAction, addNewsItemAction, updateNewsItemAction, deleteNewsItemAction } from '@/app/actions/news';

export function NewsManagementClient() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [isEditNewsModalOpen, setIsEditNewsModalOpen] = useState(false);
  const [editingNewsItem, setEditingNewsItem] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      const response = await fetchNewsItemsAction();
      if (response.success && response.data) {
        setNewsItems(response.data.map(item => ({...item, publishedAt: new Date(item.publishedAt)})));
      } else {
        toast({ title: "Error", description: response.error || "Could not load news items.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    loadNews();
  }, [toast]);

  const handleNewsAdded = async (newNewsDraft: Omit<NewsItem, 'id' | 'publishedAt'>) => {
    setIsProcessing(true);
    const response = await addNewsItemAction(newNewsDraft);
    if (response.success && response.data) {
      setNewsItems((prev) => [response.data!, ...prev].sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      toast({ title: "News Item Added", description: `"${response.data.title}" has been successfully added.`});
      setShowForm(false);
    } else {
      toast({ title: "Add Error", description: response.error || "Could not add news item.", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  const handleOpenEditNewsModal = (newsItem: NewsItem) => {
    setEditingNewsItem(newsItem);
    setIsEditNewsModalOpen(true);
  };

  const handleUpdateNewsItem = async (newsId: string, updatedData: Partial<Omit<NewsItem, 'id' | 'publishedAt'>>) => {
    setIsProcessing(true);
    const response = await updateNewsItemAction(newsId, updatedData);
    if (response.success && response.data) {
      setNewsItems((prev) =>
        prev.map((item) =>
          item.id === newsId ? { ...response.data!, publishedAt: new Date(response.data!.publishedAt) } : item
        )
      );
      toast({ title: "News Item Updated", description: `"${response.data.title}" has been updated.`});
    } else {
      toast({ title: "Update Error", description: response.error || "Could not update news item.", variant: "destructive" });
    }
    setIsProcessing(false);
    setIsEditNewsModalOpen(false);
  };

  const handleDeleteNewsItem = async (newsId: string) => {
    setIsProcessing(true);
    const response = await deleteNewsItemAction(newsId);
    if (response.success) {
      setNewsItems((prev) => prev.filter((item) => item.id !== newsId));
      toast({ title: "News Item Deleted", description: "The news item has been successfully deleted." });
    } else {
      toast({ title: "Delete Error", description: response.error || "Could not delete news item.", variant: "destructive" });
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading news...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">News Management (Berita)</h1>
        <Button onClick={() => setShowForm(!showForm)} disabled={isProcessing}>
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {showForm ? 'Cancel' : 'Add New News'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <NewsForm onNewsAdded={handleNewsAdded} isProcessing={isProcessing} />
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
              isProcessing={isProcessing}
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
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
