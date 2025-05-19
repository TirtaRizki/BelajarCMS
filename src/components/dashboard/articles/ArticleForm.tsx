
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ArticleItem } from '@/types';
import { PlusCircle, Loader2, Type, User, Image as ImageIcon, Tag } from 'lucide-react'; 

interface ArticleFormProps {
  onArticleAdded: (articleItemDraft: Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<ArticleItem>;
  onCancel?: () => void;
  isProcessing: boolean;
}

export function ArticleForm({ onArticleAdded, initialData, onCancel, isProcessing }: ArticleFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('Askhajaya Admin');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tagsString, setTagsString] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setBody(initialData.body || '');
      setAuthor(initialData.author || 'Askhajaya Admin');
      setCoverImageUrl(initialData.coverImageUrl || '');
      setTagsString(initialData.tags?.join(', ') || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim() || !author.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide title, body, and author for the article.",
        variant: "destructive",
      });
      return;
    }

    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const articleItemDraft: Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      body,
      author,
      coverImageUrl: coverImageUrl.trim() || undefined,
      tags: tagsArray,
    };

    onArticleAdded(articleItemDraft);
    
    if (!initialData?.id) {
        setTitle('');
        setBody('');
        setAuthor('Askhajaya Admin');
        setCoverImageUrl('');
        setTagsString('');
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <PlusCircle className="mr-3 h-7 w-7 text-primary" />
          {initialData?.id ? 'Edit Article' : 'Add New Article'}
        </CardTitle>
        <CardDescription>
          {initialData?.id ? 'Update the details of the article.' : 'Fill in the details to create a new content article for Askhajaya.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="article-title" className="flex items-center mb-1">
              <Type className="mr-2 h-4 w-4 text-muted-foreground" /> Title
            </Label>
            <Input
              id="article-title"
              type="text"
              placeholder="Enter article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isProcessing}
            />
          </div>
          <div>
            <Label htmlFor="article-body" className="flex items-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-muted-foreground"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"/></svg>
              Body / Content
            </Label>
            <Textarea
              id="article-body"
              placeholder="Write the article content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={10}
              disabled={isProcessing}
            />
          </div>
          <div>
            <Label htmlFor="article-author" className="flex items-center mb-1">
              <User className="mr-2 h-4 w-4 text-muted-foreground" /> Author
            </Label>
            <Input
              id="article-author"
              type="text"
              placeholder="Author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              disabled={isProcessing}
            />
          </div>
          <div>
            <Label htmlFor="article-cover-image-url" className="flex items-center mb-1">
              <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Cover Image URL (Optional)
            </Label>
            <Input
              id="article-cover-image-url"
              type="url"
              placeholder="https://example.com/cover-image.png"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              disabled={isProcessing}
            />
          </div>
           <div>
            <Label htmlFor="article-tags" className="flex items-center mb-1">
              <Tag className="mr-2 h-4 w-4 text-muted-foreground" /> Tags (comma-separated)
            </Label>
            <Input
              id="article-tags"
              type="text"
              placeholder="e.g., technology, nextjs, ai"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
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
              {isProcessing ? (initialData?.id ? 'Saving...' : 'Adding...') : (initialData?.id ? 'Save Changes' : 'Add Article')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
