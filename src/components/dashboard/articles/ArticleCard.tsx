
"use client";

import NextImage from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ArticleItem } from '@/types';
import { CalendarDays, User, Pencil, Trash2, ImageOff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type React from 'react';

interface ArticleCardProps {
  article: ArticleItem;
  onEditArticle: (article: ArticleItem) => void;
  onDeleteArticle: (articleId: string) => void;
  isProcessing: boolean;
}

export function ArticleCard({ article, onEditArticle, onDeleteArticle, isProcessing }: ArticleCardProps) {

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDeleteArticle(article.id);
  };

  return (
    <Card className="overflow-hidden shadow-lg h-full flex flex-col">
      {article.coverImageUrl ? (
        <CardHeader className="p-0">
          <div className="relative w-full aspect-[16/9] bg-muted">
            <NextImage 
              src={article.coverImageUrl} 
              alt={article.title} 
              layout="fill" 
              objectFit="cover"
            />
          </div>
        </CardHeader>
      ) : (
         <CardHeader className="p-4 bg-muted flex flex-row items-center justify-center aspect-[16/9]">
            <ImageOff className="h-12 w-12 text-muted-foreground" />
        </CardHeader>
      )}
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
        <div className="flex items-center text-xs text-muted-foreground mb-2">
            <User className="mr-1 h-3 w-3" /> {article.author}
            <span className="mx-2">|</span>
            <CalendarDays className="mr-1 h-3 w-3" /> {article.createdAt ? format(new Date(article.createdAt), "MMM dd, yyyy") : 'N/A'}
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-4 mb-3">
          {article.body}
        </CardDescription>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {article.tags.length > 4 && <Badge variant="outline" className="text-xs">+{article.tags.length - 4}</Badge>}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 border-t flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEditArticle(article)} className="gap-1" disabled={isProcessing}>
          {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
          <Pencil className="h-3 w-3" /> Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-1" disabled={isProcessing}>
              {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the article "{article.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Article
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
