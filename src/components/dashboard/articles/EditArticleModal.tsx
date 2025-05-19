
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
  onSave: (articleId: string, updatedData: Partial<Omit<ArticleItem, 'id' | 'createdAt'>>) => void;
}

export function EditArticleModal({ isOpen, onOpenChange, article, onSave }: EditArticleModalProps) {
  if (!article) return null;

  const handleSave = (updatedItem: ArticleItem) => {
    const { id, createdAt, ...dataToSave } = updatedItem;
    onSave(article.id, dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl"> {/* Wider for article form */}
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
        />
        
      </DialogContent>
    </Dialog>
  );
}
