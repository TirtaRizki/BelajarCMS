
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import type { NewsItem } from '@/types';
import { NewsForm } from './NewsForm'; // We can reuse the form

interface EditNewsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newsItem: NewsItem | null;
  onSave: (newsId: string, updatedData: Partial<Omit<NewsItem, 'id' | 'publishedAt'>>) => void;
}

export function EditNewsModal({ isOpen, onOpenChange, newsItem, onSave }: EditNewsModalProps) {
  if (!newsItem) return null;

  const handleSave = (updatedItem: NewsItem) => {
    // Extract only changed fields, id and publishedAt are handled by parent or not changed by form
    const { id, publishedAt, ...dataToSave } = updatedItem;
    onSave(newsItem.id, dataToSave);
    onOpenChange(false); // Close modal after saving
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl"> {/* Wider for form */}
        <DialogHeader>
          <DialogTitle>Edit News Item</DialogTitle>
          <DialogDescription>
            Update the details for "{newsItem.title}". Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        {/* Reuse NewsForm for editing */}
        <NewsForm 
            initialData={newsItem} 
            onNewsAdded={handleSave} // onNewsAdded will be effectively onNewsUpdated here
            onCancel={() => onOpenChange(false)}
        />
        
        {/* DialogFooter is handled by NewsForm's buttons now */}
      </DialogContent>
    </Dialog>
  );
}
