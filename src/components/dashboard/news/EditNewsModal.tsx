
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { NewsItem } from '@/types';
import { NewsForm } from './NewsForm'; 

interface EditNewsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newsItem: NewsItem | null;
  onSave: (newsId: string, updatedData: Partial<Omit<NewsItem, 'id' | 'publishedAt'>>) => void;
  isProcessing: boolean;
}

export function EditNewsModal({ isOpen, onOpenChange, newsItem, onSave, isProcessing }: EditNewsModalProps) {
  if (!newsItem) return null;

  const handleSave = (updatedItem: NewsItem) => {
    const { id, publishedAt, ...dataToSave } = updatedItem;
    onSave(newsItem.id, dataToSave);
    // Parent handles closing modal and toast
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && onOpenChange(open)}>
      <DialogContent className="sm:max-w-2xl"> 
        <DialogHeader>
          <DialogTitle>Edit News Item</DialogTitle>
          <DialogDescription>
            Update the details for "{newsItem.title}". Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <NewsForm 
            initialData={newsItem} 
            onNewsAdded={handleSave} 
            onCancel={() => onOpenChange(false)}
            isProcessing={isProcessing}
        />
      </DialogContent>
    </Dialog>
  );
}
