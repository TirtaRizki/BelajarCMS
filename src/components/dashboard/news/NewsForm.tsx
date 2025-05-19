
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { NewsItem } from '@/types';
import { PlusCircle, Loader2, Type, FileText as ContentIcon, Tag, Image as ImageIcon } from 'lucide-react';

interface NewsFormProps {
  onNewsAdded: (newsItemDraft: Omit<NewsItem, 'id' | 'publishedAt'>) => void;
  initialData?: Partial<NewsItem>; 
  onCancel?: () => void;
  isProcessing: boolean;
}

export function NewsForm({ onNewsAdded, initialData, onCancel, isProcessing }: NewsFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setCategory(initialData.category || '');
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim() || !category.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide title, content, and category for the news item.",
        variant: "destructive",
      });
      return;
    }

    const newsItemDraft: Omit<NewsItem, 'id' | 'publishedAt'> = {
      title,
      content,
      category,
      imageUrl: imageUrl.trim() || undefined,
    };

    onNewsAdded(newsItemDraft);
    
    if (!initialData?.id) { 
        setTitle('');
        setContent('');
        setCategory('');
        setImageUrl('');
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <PlusCircle className="mr-3 h-7 w-7 text-primary" />
          {initialData?.id ? 'Edit News Item' : 'Add New News Item'}
        </CardTitle>
        <CardDescription>
          {initialData?.id ? 'Update the details of the news item.' : 'Fill in the details to create a new news item for Askhajaya.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="news-title" className="flex items-center mb-1">
              <Type className="mr-2 h-4 w-4 text-muted-foreground" /> Title
            </Label>
            <Input
              id="news-title"
              type="text"
              placeholder="Enter news title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isProcessing}
            />
          </div>
          <div>
            <Label htmlFor="news-content" className="flex items-center mb-1">
              <ContentIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Content
            </Label>
            <Textarea
              id="news-content"
              placeholder="Write the news content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              disabled={isProcessing}
            />
          </div>
          <div>
            <Label htmlFor="news-category" className="flex items-center mb-1">
              <Tag className="mr-2 h-4 w-4 text-muted-foreground" /> Category
            </Label>
            <Input
              id="news-category"
              type="text"
              placeholder="e.g., Announcement, Update, Event"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={isProcessing}
            />
          </div>
          <div>
            <Label htmlFor="news-image-url" className="flex items-center mb-1">
              <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Image URL (Optional)
            </Label>
            <Input
              id="news-image-url"
              type="url"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <div className="flex gap-2 justify-end">
            {onCancel && (
                 <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
                    Cancel
                </Button>
            )}
            <Button type="submit" className="text-base" disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-5 w-5" />
              )}
              {isProcessing ? (initialData?.id ? 'Saving...' : 'Adding...') : (initialData?.id ? 'Save Changes' : 'Add News Item')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
