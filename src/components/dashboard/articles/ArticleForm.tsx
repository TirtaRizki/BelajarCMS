
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ArticleItem } from '@/types';
import { PlusCircle, Loader2, Type, User, Image as ImageIcon, Tag } from 'lucide-react'; // ContentIcon removed, using Type for title, FileText for body

interface ArticleFormProps {
  onArticleAdded: (articleItem: ArticleItem) => void;
  initialData?: Partial<ArticleItem>;
  onCancel?: () => void;
}

export function ArticleForm({ onArticleAdded, initialData, onCancel }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [author, setAuthor] = useState(initialData?.author || 'Askhajaya Admin'); // Default author
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || '');
  const [tagsString, setTagsString] = useState(initialData?.tags?.join(', ') || ''); // Tags as comma-separated string

  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const newArticleItem: ArticleItem = {
      id: initialData?.id || crypto.randomUUID(),
      title,
      body,
      author,
      coverImageUrl: coverImageUrl.trim() || undefined,
      createdAt: initialData?.createdAt || new Date(),
      tags: tagsArray,
    };

    onArticleAdded(newArticleItem);
    
    toast({
      title: initialData?.id ? "Article Updated" : "Article Added",
      description: `"${title}" has been successfully ${initialData?.id ? 'updated' : 'added'}.`,
    });

    if (!initialData?.id) {
        setTitle('');
        setBody('');
        setAuthor('Askhajaya Admin');
        setCoverImageUrl('');
        setTagsString('');
    }
    setIsProcessing(false);
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
            />
          </div>
          <div>
            <Label htmlFor="article-body" className="flex items-center mb-1">
              {/* Using a generic icon for body, as FileText is used in sidebar */}
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
