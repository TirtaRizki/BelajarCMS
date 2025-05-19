
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { ArticleItem } from '@/types';
import { ArticleForm } from './ArticleForm';

interface EditArticleModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  article: ArticleItem | null;
  onSave: (articleId: string, updatedData: Partial<Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  isProcessing: boolean;
}

export function EditArticleModal({ isOpen, onOpenChange, article, onSave, isProcessing }: EditArticleModalProps) {
  if (!article) return null;

  const handleSave = (updatedItemDraft: Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    onSave(article.id, updatedItemDraft);
    // Parent handles closing modal and toast
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && onOpenChange(open)}>
      <DialogContent className="sm:max-w-3xl"> 
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
          <DialogDescription>
            Update the details for "{article.title}". Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <ArticleForm 
            initialData={article} 
            onArticleAdded={handleSave} 
            onCancel={() => onOpenChange(false)}
            isProcessing={isProcessing}
        />
        
      </DialogContent>
    </Dialog>
  );
}
